#!/usr/bin/env python3
"""Validate the static portfolio without third-party dependencies."""

from __future__ import annotations

import hashlib
import json
import os
import posixpath
import re
import threading
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
SITE_ORIGIN = "https://pacifiquefashaho.github.io"
GOOGLE_FILE = "google32dbf3697617861a.html"
GOOGLE_SHA256 = "70d3bfaab6f818d1c3ef14f37797e691c1a9bf4d3d2cc61d225576ea1baac0ae"
ENGLISH_CV = "Pacifique_Fashaho_CV.pdf"
FRENCH_CV = "Pacifique_Fashaho_CV_FR.pdf"
LEGACY_DOCUMENT_BUNDLE = "assets/certificates/Pacifique-Full-files.pdf"

PAGE_SPECS = {
    "index.html": ("/", "en"),
    "fr/index.html": ("/fr/", "fr"),
    "projects.html": ("/projects.html", "en"),
    "certifications.html": ("/certifications.html", "en"),
    "project-it-support-case-study.html": (
        "/project-it-support-case-study.html",
        "en",
    ),
    "project-network-printer-case-study.html": (
        "/project-network-printer-case-study.html",
        "en",
    ),
    "project-workstation-user-setup.html": (
        "/project-workstation-user-setup.html",
        "en",
    ),
    "it-support-resources.html": ("/it-support-resources.html", "en"),
    "fr/project-network-printer-case-study.html": (
        "/fr/project-network-printer-case-study.html",
        "fr",
    ),
    "fr/project-workstation-user-setup.html": (
        "/fr/project-workstation-user-setup.html",
        "fr",
    ),
    "fr/it-support-resources.html": ("/fr/it-support-resources.html", "fr"),
    "project-data-cleaning-case-study.html": (
        "/project-data-cleaning-case-study.html",
        "en",
    ),
    "project-sales-dashboard.html": ("/project-sales-dashboard.html", "en"),
}

BILINGUAL_PAGE_PAIRS = (
    ("index.html", "fr/index.html"),
    (
        "project-network-printer-case-study.html",
        "fr/project-network-printer-case-study.html",
    ),
    (
        "project-workstation-user-setup.html",
        "fr/project-workstation-user-setup.html",
    ),
    ("it-support-resources.html", "fr/it-support-resources.html"),
)

DETAILED_CASE_STUDY_PAGES = (
    "project-it-support-case-study.html",
    "project-network-printer-case-study.html",
    "project-workstation-user-setup.html",
    "project-data-cleaning-case-study.html",
    "project-sales-dashboard.html",
)

JSON_FILES = (
    "assets/data/projects.json",
    "assets/data/certifications.json",
)

CSS_FILES = (
    "assets/css/style.css",
    "assets/css/pages.css",
)


def collect_repository_files() -> set[str]:
    """Return file paths with their exact repository casing."""
    repository_files: set[str] = set()

    for current_directory, directory_names, file_names in os.walk(ROOT):
        directory_names[:] = [
            name
            for name in directory_names
            if name not in {".git", "__pycache__"}
        ]
        current_path = Path(current_directory)

        for file_name in file_names:
            repository_files.add(
                (current_path / file_name).relative_to(ROOT).as_posix()
            )

    return repository_files


REPOSITORY_FILES = collect_repository_files()


class PortfolioHTMLParser(HTMLParser):
    """Collect the static page features needed by the quality checks."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.has_html5_doctype = False
        self.language: str | None = None
        self.has_viewport = False
        self.title_parts: list[str] = []
        self.in_title = False
        self.main_count = 0
        self.ids: list[str] = []
        self.headings: list[int] = []
        self.references: list[tuple[str, str]] = []
        self.images: list[dict[str, str | None]] = []
        self.blank_target_links: list[dict[str, str | None]] = []
        self.assistant_suggestions: list[dict[str, str | None]] = []
        self.alternate_links: dict[str, str] = {}
        self.canonical_url: str | None = None
        self.json_ld_blocks: list[str] = []
        self.in_json_ld = False
        self.json_ld_parts: list[str] = []

    def handle_decl(self, declaration: str) -> None:
        if declaration.lower() == "doctype html":
            self.has_html5_doctype = True

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        attributes = dict(attrs)

        if tag == "html":
            self.language = attributes.get("lang")
        elif tag == "meta" and (attributes.get("name") or "").lower() == "viewport":
            self.has_viewport = True
        elif tag == "title":
            self.in_title = True
        elif tag == "main":
            self.main_count += 1

        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(int(tag[1]))

        element_id = attributes.get("id")
        if element_id:
            self.ids.append(element_id)

        if tag in {"a", "link"}:
            self._add_reference(tag, attributes.get("href"))

        if tag == "link" and "alternate" in (
            attributes.get("rel") or ""
        ).lower().split():
            language = attributes.get("hreflang")
            href = attributes.get("href")
            if language and href:
                self.alternate_links[language.lower()] = href

        if tag == "link" and "canonical" in (
            attributes.get("rel") or ""
        ).lower().split():
            self.canonical_url = attributes.get("href")

        if tag in {"img", "script", "source"}:
            self._add_reference(tag, attributes.get("src"))

        if tag in {"img", "source"}:
            self._add_srcset_references(tag, attributes.get("srcset"))

        if tag == "img":
            self.images.append(attributes)

        if tag == "a" and attributes.get("target") == "_blank":
            self.blank_target_links.append(attributes)

        if (
            tag == "button"
            and "chat-suggestion" in (attributes.get("class") or "").split()
        ):
            self.assistant_suggestions.append(attributes)

        if (
            tag == "script"
            and (attributes.get("type") or "").lower() == "application/ld+json"
        ):
            self.in_json_ld = True
            self.json_ld_parts = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

        if tag == "script" and self.in_json_ld:
            self.json_ld_blocks.append("".join(self.json_ld_parts))
            self.in_json_ld = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.in_json_ld:
            self.json_ld_parts.append(data)

    def _add_reference(self, tag: str, value: str | None) -> None:
        if value:
            self.references.append((tag, value))

    def _add_srcset_references(self, tag: str, srcset: str | None) -> None:
        if not srcset:
            return

        for candidate in srcset.split(","):
            value = candidate.strip().split(maxsplit=1)[0]
            if value:
                self.references.append((f"{tag} srcset", value))


class QuietRequestHandler(SimpleHTTPRequestHandler):
    """Serve the repository without writing request logs to CI output."""

    def log_message(self, _format: str, *args: object) -> None:
        del args


def add_error(errors: list[str], condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def read_text(relative_path: str, errors: list[str]) -> str | None:
    path = ROOT / relative_path

    if not path.is_file():
        errors.append(f"{relative_path}: required file is missing")
        return None

    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as error:
        errors.append(f"{relative_path}: is not valid UTF-8 ({error})")
        return None


def resolve_local_reference(page: str, reference: str) -> Path | None:
    if reference.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None

    parsed = urlparse(reference)

    if parsed.scheme in {"http", "https"}:
        if parsed.netloc != urlparse(SITE_ORIGIN).netloc:
            return None
        reference_path = parsed.path
    elif parsed.scheme:
        return None
    else:
        reference_path = parsed.path

    if not reference_path:
        return ROOT / page

    reference_path = unquote(reference_path)

    if reference_path.startswith("/"):
        resolved = ROOT / reference_path.lstrip("/")
    else:
        resolved = (ROOT / page).parent / reference_path

    if reference_path.endswith("/"):
        resolved /= "index.html"

    return resolved.resolve()


def local_reference_repository_path(
    page: str,
    reference: str,
) -> str | None:
    """Resolve a local URL to a normalized repository path without changing case."""
    if reference.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None

    parsed = urlparse(reference)

    if parsed.scheme in {"http", "https"}:
        if parsed.netloc != urlparse(SITE_ORIGIN).netloc:
            return None
        reference_path = parsed.path
    elif parsed.scheme:
        return None
    else:
        reference_path = parsed.path

    if not reference_path:
        return PurePosixPath(page).as_posix()

    reference_path = unquote(reference_path)

    if reference_path.startswith("/"):
        repository_path = reference_path.lstrip("/")
    else:
        repository_path = (
            PurePosixPath(page).parent / PurePosixPath(reference_path)
        ).as_posix()

    repository_path = posixpath.normpath(repository_path)

    if reference_path.endswith("/"):
        repository_path = posixpath.join(repository_path, "index.html")

    return repository_path.lstrip("./")


def parse_pages(
    errors: list[str],
) -> dict[str, PortfolioHTMLParser]:
    parsed_pages: dict[str, PortfolioHTMLParser] = {}

    for page, (_, expected_language) in PAGE_SPECS.items():
        source = read_text(page, errors)
        if source is None:
            continue

        parser = PortfolioHTMLParser()
        parser.feed(source)
        parser.close()
        parsed_pages[page] = parser

        add_error(
            errors,
            parser.has_html5_doctype,
            f"{page}: missing HTML5 doctype",
        )
        add_error(
            errors,
            parser.language == expected_language,
            f"{page}: expected lang={expected_language!r}, found {parser.language!r}",
        )
        add_error(
            errors,
            parser.has_viewport,
            f"{page}: missing viewport metadata",
        )
        add_error(
            errors,
            bool("".join(parser.title_parts).strip()),
            f"{page}: missing or empty title",
        )
        add_error(
            errors,
            parser.main_count == 1,
            f"{page}: expected one main element, found {parser.main_count}",
        )

        h1_count = parser.headings.count(1)
        add_error(
            errors,
            h1_count == 1,
            f"{page}: expected one h1, found {h1_count}",
        )

        duplicate_ids = sorted(
            element_id
            for element_id, count in Counter(parser.ids).items()
            if count > 1
        )
        add_error(
            errors,
            not duplicate_ids,
            f"{page}: duplicate IDs: {', '.join(duplicate_ids)}",
        )

        for previous, current in zip(parser.headings, parser.headings[1:]):
            if current > previous + 1:
                errors.append(
                    f"{page}: heading level jumps from h{previous} to h{current}"
                )

        add_error(
            errors,
            bool(parser.json_ld_blocks),
            f"{page}: missing JSON-LD block",
        )

        for block_number, block in enumerate(parser.json_ld_blocks, start=1):
            try:
                json.loads(block)
            except json.JSONDecodeError as error:
                errors.append(
                    f"{page}: JSON-LD block {block_number} is invalid ({error})"
                )

        for image in parser.images:
            source_path = image.get("src") or "(missing src)"
            add_error(
                errors,
                "alt" in image,
                f"{page}: image lacks alt attribute: {source_path}",
            )

            width = image.get("width")
            height = image.get("height")
            dimensions_are_valid = (
                bool(width)
                and bool(height)
                and str(width).isdigit()
                and str(height).isdigit()
                and int(str(width)) > 0
                and int(str(height)) > 0
            )
            add_error(
                errors,
                dimensions_are_valid,
                f"{page}: image lacks positive integer dimensions: {source_path}",
            )

        for link in parser.blank_target_links:
            relation = set((link.get("rel") or "").split())
            add_error(
                errors,
                {"noopener", "noreferrer"}.issubset(relation),
                (
                    f"{page}: target=_blank link requires noopener and noreferrer: "
                    f"{link.get('href') or '(missing href)'}"
                ),
            )

    return parsed_pages


def validate_references(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    for page, parser in parsed_pages.items():
        for tag, reference in parser.references:
            resolved = resolve_local_reference(page, reference)
            repository_path = local_reference_repository_path(page, reference)

            if resolved is not None and repository_path is not None:
                add_error(
                    errors,
                    repository_path in REPOSITORY_FILES,
                    f"{page}: missing local {tag} resource: {reference}",
                )

            fragment = unquote(urlparse(reference).fragment)
            if not fragment:
                continue

            target_page = page
            if resolved is not None and resolved.suffix.lower() == ".html":
                try:
                    target_page = resolved.relative_to(ROOT).as_posix()
                except ValueError:
                    continue

            target_parser = parsed_pages.get(target_page)
            if target_parser is not None:
                add_error(
                    errors,
                    fragment in target_parser.ids,
                    f"{page}: missing fragment target: {reference}",
                )


def validate_css(errors: list[str]) -> None:
    for stylesheet in CSS_FILES:
        source = read_text(stylesheet, errors)
        if source is None:
            continue

        for raw_reference in re.findall(r"url\(([^)]+)\)", source):
            reference = raw_reference.strip().strip("\"'")
            if not reference or reference.startswith(
                ("data:", "#", "http://", "https://")
            ):
                continue

            repository_path = posixpath.normpath(
                (
                    PurePosixPath(stylesheet).parent
                    / PurePosixPath(unquote(reference))
                ).as_posix()
            ).lstrip("./")
            add_error(
                errors,
                repository_path in REPOSITORY_FILES,
                f"{stylesheet}: missing url() asset: {reference}",
            )


def validate_json(errors: list[str]) -> None:
    for json_file in JSON_FILES:
        source = read_text(json_file, errors)
        if source is None:
            continue

        try:
            json.loads(source)
        except json.JSONDecodeError as error:
            errors.append(f"{json_file}: invalid JSON ({error})")


def validate_bilingual_pages(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    for english_page, french_page in BILINGUAL_PAGE_PAIRS:
        english_route = PAGE_SPECS[english_page][0]
        french_route = PAGE_SPECS[french_page][0]
        expected_links = {
            "en": f"{SITE_ORIGIN}{english_route}",
            "fr": f"{SITE_ORIGIN}{french_route}",
            "x-default": f"{SITE_ORIGIN}{english_route}",
        }

        for page in (english_page, french_page):
            parser = parsed_pages.get(page)
            if parser is None:
                continue

            expected_canonical = expected_links[PAGE_SPECS[page][1]]
            add_error(
                errors,
                parser.canonical_url == expected_canonical,
                f"{page}: canonical URL does not match its language route",
            )
            add_error(
                errors,
                parser.alternate_links == expected_links,
                f"{page}: hreflang links do not match its bilingual page pair",
            )

            if page not in {"index.html", "fr/index.html"}:
                expected_language = PAGE_SPECS[page][1]
                structured_languages: list[str] = []
                for block in parser.json_ld_blocks:
                    try:
                        structured_data = json.loads(block)
                    except json.JSONDecodeError:
                        continue
                    if isinstance(structured_data, dict):
                        language = structured_data.get("inLanguage")
                        if isinstance(language, str):
                            structured_languages.append(language)

                add_error(
                    errors,
                    expected_language in structured_languages,
                    f"{page}: JSON-LD inLanguage does not match the page language",
                )


def validate_quick_assistant(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    expected_intents = Counter(
        {
            "opportunity": 3,
            "support": 1,
            "dashboard": 1,
            "data": 1,
            "field": 1,
        }
    )
    expected_scripts = {
        "index.html": (
            "assets/js/assistant-intents.js",
            "assets/js/contact-assistant.js",
            "assets/js/main.js",
        ),
        "fr/index.html": (
            "../assets/js/assistant-intents.js",
            "../assets/js/contact-assistant.js",
            "../assets/js/main.js",
        ),
    }

    for page, scripts in expected_scripts.items():
        parser = parsed_pages.get(page)
        if parser is None:
            continue

        script_references = [
            reference
            for tag, reference in parser.references
            if tag == "script"
        ]
        assistant_script, contact_script, main_script = scripts

        add_error(
            errors,
            assistant_script in script_references,
            f"{page}: Quick Assistant intent engine script is missing",
        )
        add_error(
            errors,
            contact_script in script_references,
            f"{page}: contact and assistant script is missing",
        )
        add_error(
            errors,
            main_script in script_references,
            f"{page}: main JavaScript entry point is missing",
        )

        if (
            assistant_script in script_references
            and contact_script in script_references
            and main_script in script_references
        ):
            add_error(
                errors,
                script_references.index(assistant_script)
                < script_references.index(contact_script)
                < script_references.index(main_script),
                f"{page}: specialized scripts must load before main.js",
            )

        suggestion_intents = Counter(
            suggestion.get("data-intent")
            for suggestion in parser.assistant_suggestions
        )
        add_error(
            errors,
            suggestion_intents == expected_intents,
            f"{page}: Quick Assistant suggestion intents are incomplete "
            f"({dict(suggestion_intents)})",
        )

        for suggestion in parser.assistant_suggestions:
            add_error(
                errors,
                bool((suggestion.get("data-message") or "").strip()),
                f"{page}: Quick Assistant suggestion has no prepared message",
            )

    for page, parser in parsed_pages.items():
        if page in expected_scripts:
            continue

        script_references = {
            reference
            for tag, reference in parser.references
            if tag == "script"
        }
        add_error(
            errors,
            not any(
                reference.endswith(
                    ("assistant-intents.js", "contact-assistant.js")
                )
                for reference in script_references
            ),
            f"{page}: home-page-only assistant scripts must not be loaded",
        )


def validate_javascript_architecture(errors: list[str]) -> None:
    main_source = read_text("assets/js/main.js", errors)
    contact_source = read_text("assets/js/contact-assistant.js", errors)

    if main_source is not None:
        add_error(
            errors,
            "assistantLauncher" not in main_source
            and "contactForm" not in main_source,
            "assets/js/main.js: home-page-only contact logic leaked into "
            "the shared bundle",
        )
        add_error(
            errors,
            len(main_source.encode("utf-8")) <= 32_000,
            "assets/js/main.js: shared bundle exceeded the 32 KB size budget",
        )

    if contact_source is not None:
        required_contracts = (
            "contactForm",
            "copyEmail",
            "assistantLauncher",
            "QuickAssistantIntents",
        )
        for contract in required_contracts:
            add_error(
                errors,
                contract in contact_source,
                f"assets/js/contact-assistant.js: missing {contract} contract",
            )

    for legacy_script in (
        "assets/js/projects.js",
        "assets/js/certifications.js",
    ):
        add_error(
            errors,
            legacy_script not in REPOSITORY_FILES,
            f"{legacy_script}: unused legacy script should not be restored",
        )


def validate_project_catalog(errors: list[str]) -> None:
    source = read_text("projects.html", errors)
    if source is None:
        return

    project_categories = re.findall(
        r'<article\b[^>]*\bclass="[^"]*\bproject\b[^"]*"'
        r'[^>]*\bdata-category="([^"]+)"',
        source,
    )
    project_count = len(project_categories)

    parser = PortfolioHTMLParser()
    parser.feed(source)
    parser.close()

    item_list: list[object] | None = None
    for block in parser.json_ld_blocks:
        try:
            structured_data = json.loads(block)
        except json.JSONDecodeError:
            continue

        if structured_data.get("@type") == "CollectionPage":
            main_entity = structured_data.get("mainEntity", {})
            if main_entity.get("@type") == "ItemList":
                item_list = main_entity.get("itemListElement")
                break

    add_error(
        errors,
        isinstance(item_list, list),
        "projects.html: CollectionPage JSON-LD ItemList is missing",
    )

    if isinstance(item_list, list):
        positions = [
            item.get("position")
            for item in item_list
            if isinstance(item, dict)
        ]
        add_error(
            errors,
            len(item_list) == project_count,
            "projects.html: project cards and JSON-LD ItemList counts differ",
        )
        add_error(
            errors,
            positions == list(range(1, project_count + 1)),
            "projects.html: JSON-LD ItemList positions are not consecutive",
        )

    def validate_stat(label: str, expected: int) -> None:
        match = re.search(
            r'<span class="stat-num" data-target="(\d+)">(\d+)</span>\s*'
            rf'<span class="label">{re.escape(label)}</span>',
            source,
        )
        add_error(
            errors,
            bool(
                match
                and int(match.group(1)) == expected
                and int(match.group(2)) == expected
            ),
            f"projects.html: {label} target and no-JavaScript value must both be {expected}",
        )

    validate_stat("Portfolio Projects", project_count)
    validate_stat("Project Categories", len(set(project_categories)))
    validate_stat("Detailed Case Studies", len(DETAILED_CASE_STUDY_PAGES))

    homepage_proofs = (
        ("index.html", "portfolio projects"),
        ("fr/index.html", "projets du portfolio"),
    )
    for page, label in homepage_proofs:
        homepage = read_text(page, errors)
        if homepage is None:
            continue

        proof = re.search(
            rf"<strong>(\d+)</strong>\s*"
            rf'<a\b[^>]*>{re.escape(label)}</a>',
            homepage,
        )
        add_error(
            errors,
            bool(proof and int(proof.group(1)) == project_count),
            f"{page}: homepage project proof must match the {project_count}-project catalog",
        )


def validate_recruiter_documents(errors: list[str]) -> None:
    for document in (ENGLISH_CV, FRENCH_CV):
        path = ROOT / document
        if not path.is_file():
            errors.append(f"{document}: recruiter PDF is missing")
            continue

        contents = path.read_bytes()
        add_error(
            errors,
            len(contents) >= 50_000,
            f"{document}: recruiter PDF is unexpectedly small",
        )
        add_error(
            errors,
            contents.startswith(b"%PDF-") and b"%%EOF" in contents[-1024:],
            f"{document}: file does not contain a complete PDF signature",
        )

    add_error(
        errors,
        not (ROOT / LEGACY_DOCUMENT_BUNDLE).exists(),
        f"{LEGACY_DOCUMENT_BUNDLE}: legacy document bundle must remain absent",
    )

    link_expectations = (
        ("index.html", ENGLISH_CV, FRENCH_CV),
        ("fr/index.html", f"../{FRENCH_CV}", f"../{ENGLISH_CV}"),
    )
    for page, expected_document, excluded_document in link_expectations:
        source = read_text(page, errors)
        if source is None:
            continue

        add_error(
            errors,
            source.count(f'href="{expected_document}"') == 2,
            f"{page}: expected exactly two links to {expected_document}",
        )
        add_error(
            errors,
            f'href="{excluded_document}"' not in source,
            f"{page}: contains a link to the wrong-language recruiter PDF",
        )


def validate_sitemap(errors: list[str]) -> None:
    sitemap_path = ROOT / "sitemap.xml"

    try:
        tree = ElementTree.parse(sitemap_path)
    except (ElementTree.ParseError, OSError) as error:
        errors.append(f"sitemap.xml: invalid or unreadable XML ({error})")
        return

    namespace = {"sitemap": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locations = [
        element.text.strip()
        for element in tree.findall("sitemap:url/sitemap:loc", namespace)
        if element.text and element.text.strip()
    ]
    expected_locations = {
        f"{SITE_ORIGIN}{route}" for route, _ in PAGE_SPECS.values()
    }

    add_error(
        errors,
        len(locations) == len(set(locations)),
        "sitemap.xml: contains duplicate URLs",
    )
    add_error(
        errors,
        set(locations) == expected_locations,
        "sitemap.xml: URL set does not match the configured public pages",
    )

    for sitemap_url in locations:
        target = resolve_local_reference("index.html", sitemap_url)
        add_error(
            errors,
            target is not None and target.is_file(),
            f"sitemap.xml: URL does not resolve to a local page: {sitemap_url}",
        )

    last_modified_pattern = re.compile(r"\d{4}-\d{2}-\d{2}")
    for url_element in tree.findall("sitemap:url", namespace):
        location = url_element.findtext("sitemap:loc", namespaces=namespace)
        last_modified = url_element.findtext(
            "sitemap:lastmod",
            namespaces=namespace,
        )
        add_error(
            errors,
            bool(last_modified and last_modified_pattern.fullmatch(last_modified)),
            f"sitemap.xml: invalid lastmod for {location or '(missing loc)'}",
        )


def validate_workbench(errors: list[str]) -> None:
    page_tokens = (
        "data-workbench",
        "data-workbench-controls",
        "data-workbench-output",
        'data-workbench-scenario="windows"',
        'data-workbench-scenario="network"',
        'data-workbench-scenario="setup"',
        "<noscript",
    )

    for page in ("index.html", "fr/index.html"):
        source = read_text(page, errors)
        if source is None:
            continue

        for token in page_tokens:
            add_error(
                errors,
                token in source,
                f"{page}: Workbench or no-JavaScript marker missing: {token}",
            )

    javascript = read_text("assets/js/main.js", errors)
    if javascript is not None:
        for token in (
            "[data-workbench]",
            "[data-workbench-controls]",
            "[data-workbench-output]",
            "prefers-reduced-motion",
        ):
            add_error(
                errors,
                token in javascript,
                f"assets/js/main.js: Workbench marker missing: {token}",
            )

        for route in (
            "project-network-printer-case-study.html",
            "project-workstation-user-setup.html",
        ):
            add_error(
                errors,
                javascript.count(f'href: "{route}"') == 2,
                f"assets/js/main.js: expected English and French Workbench routes for {route}",
            )

    stylesheet = read_text("assets/css/style.css", errors)
    if stylesheet is not None:
        add_error(
            errors,
            "@media (prefers-reduced-motion: reduce)" in stylesheet,
            "assets/css/style.css: reduced-motion media query is missing",
        )


def validate_protected_resources(errors: list[str]) -> None:
    google_path = ROOT / GOOGLE_FILE
    if not google_path.is_file():
        errors.append(f"{GOOGLE_FILE}: protected verification file is missing")
    else:
        actual_hash = hashlib.sha256(google_path.read_bytes()).hexdigest()
        add_error(
            errors,
            actual_hash == GOOGLE_SHA256,
            f"{GOOGLE_FILE}: protected verification file hash changed",
        )

    sales_preview = ROOT / "assets/images/projects/sales-dashboard-preview.jpg"
    if not sales_preview.is_file():
        errors.append("sales-dashboard-preview.jpg: file is missing")
    else:
        add_error(
            errors,
            sales_preview.read_bytes()[:3] == b"\xff\xd8\xff",
            "sales-dashboard-preview.jpg: contents are not genuine JPEG data",
        )

    robots = read_text("robots.txt", errors)
    if robots is not None:
        add_error(
            errors,
            f"Sitemap: {SITE_ORIGIN}/sitemap.xml" in robots,
            "robots.txt: canonical sitemap declaration is missing",
        )


def smoke_test_routes(errors: list[str]) -> None:
    handler = lambda *args, **kwargs: QuietRequestHandler(  # noqa: E731
        *args,
        directory=str(ROOT),
        **kwargs,
    )
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        port = server.server_address[1]
        for _, (route, _) in PAGE_SPECS.items():
            try:
                with urllib.request.urlopen(
                    f"http://127.0.0.1:{port}{route}",
                    timeout=5,
                ) as response:
                    add_error(
                        errors,
                        response.status == 200,
                        f"{route}: local HTTP status was {response.status}",
                    )
            except OSError as error:
                errors.append(f"{route}: local HTTP smoke test failed ({error})")

        for document in (ENGLISH_CV, FRENCH_CV):
            try:
                with urllib.request.urlopen(
                    f"http://127.0.0.1:{port}/{document}",
                    timeout=5,
                ) as response:
                    add_error(
                        errors,
                        response.status == 200 and response.read(5) == b"%PDF-",
                        f"/{document}: local PDF smoke test failed",
                    )
            except OSError as error:
                errors.append(
                    f"/{document}: local PDF smoke test failed ({error})"
                )
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)


def main() -> int:
    errors: list[str] = []

    parsed_pages = parse_pages(errors)
    validate_references(parsed_pages, errors)
    validate_bilingual_pages(parsed_pages, errors)
    validate_quick_assistant(parsed_pages, errors)
    validate_javascript_architecture(errors)
    validate_css(errors)
    validate_json(errors)
    validate_project_catalog(errors)
    validate_recruiter_documents(errors)
    validate_sitemap(errors)
    validate_workbench(errors)
    validate_protected_resources(errors)
    smoke_test_routes(errors)

    if errors:
        print(f"Static portfolio validation failed with {len(errors)} error(s):")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "Static portfolio validation passed: "
        f"{len(PAGE_SPECS)} pages, internal resources, accessibility markers, JSON-LD, "
        "JSON, XML, recruiter PDFs, protected resources, and HTTP routes."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

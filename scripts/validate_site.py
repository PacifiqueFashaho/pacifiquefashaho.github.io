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
SITE_ORIGIN = "https://pacifiquefashaho.me"
GOOGLE_FILE = "google32dbf3697617861a.html"
GOOGLE_SHA256 = "70d3bfaab6f818d1c3ef14f37797e691c1a9bf4d3d2cc61d225576ea1baac0ae"
ENGLISH_CV = "Pacifique_Fashaho_CV.pdf"
FRENCH_CV = "Pacifique_Fashaho_CV_FR.pdf"
LEGACY_DOCUMENT_BUNDLE = "assets/certificates/Pacifique-Full-files.pdf"
PRIVATE_STUDENT_RECORD = (
    "assets/certificates/Confirmation-of-student-status.pdf"
)

PAGE_SPECS = {
    "index.html": ("/", "en"),
    "fr/index.html": ("/fr/", "fr"),
    "portfolio.html": ("/portfolio.html", "en"),
    "fr/portfolio.html": ("/fr/portfolio.html", "fr"),
    "projects.html": ("/projects.html", "en"),
    "fr/projects.html": ("/fr/projects.html", "fr"),
    "certifications.html": ("/certifications.html", "en"),
    "fr/certifications.html": ("/fr/certifications.html", "fr"),
    "privacy.html": ("/privacy.html", "en"),
    "fr/privacy.html": ("/fr/privacy.html", "fr"),
    "project-it-support-case-study.html": (
        "/project-it-support-case-study.html",
        "en",
    ),
    "fr/project-it-support-case-study.html": (
        "/fr/project-it-support-case-study.html",
        "fr",
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
    "it-support-knowledge.html": ("/it-support-knowledge.html", "en"),
    "fr/it-support-knowledge.html": ("/fr/it-support-knowledge.html", "fr"),
    "project-data-cleaning-case-study.html": (
        "/project-data-cleaning-case-study.html",
        "en",
    ),
    "project-sales-dashboard.html": ("/project-sales-dashboard.html", "en"),
    "fr/project-data-cleaning-case-study.html": (
        "/fr/project-data-cleaning-case-study.html",
        "fr",
    ),
    "project-portfolio-case-study.html": (
        "/project-portfolio-case-study.html",
        "en",
    ),
    "fr/project-portfolio-case-study.html": (
        "/fr/project-portfolio-case-study.html",
        "fr",
    ),
    "fr/project-sales-dashboard.html": (
        "/fr/project-sales-dashboard.html",
        "fr",
    ),
    "windows-checks-before-it-support.html": (
        "/windows-checks-before-it-support.html",
        "en",
    ),
    "fr/windows-checks-before-it-support.html": (
        "/fr/windows-checks-before-it-support.html",
        "fr",
    ),
    "suspicious-tech-support-pop-up.html": (
        "/suspicious-tech-support-pop-up.html",
        "en",
    ),
    "fr/suspicious-tech-support-pop-up.html": (
        "/fr/suspicious-tech-support-pop-up.html",
        "fr",
    ),
    "windows-storage-full-safe-checks.html": (
        "/windows-storage-full-safe-checks.html",
        "en",
    ),
    "fr/windows-storage-full-safe-checks.html": (
        "/fr/windows-storage-full-safe-checks.html",
        "fr",
    ),
    "windows-wifi-no-internet-safe-checks.html": (
        "/windows-wifi-no-internet-safe-checks.html",
        "en",
    ),
    "fr/windows-wifi-no-internet-safe-checks.html": (
        "/fr/windows-wifi-no-internet-safe-checks.html",
        "fr",
    ),
}

BILINGUAL_PAGE_PAIRS = (
    ("index.html", "fr/index.html"),
    ("portfolio.html", "fr/portfolio.html"),
    ("projects.html", "fr/projects.html"),
    ("certifications.html", "fr/certifications.html"),
    ("privacy.html", "fr/privacy.html"),
    (
        "project-it-support-case-study.html",
        "fr/project-it-support-case-study.html",
    ),
    (
        "project-network-printer-case-study.html",
        "fr/project-network-printer-case-study.html",
    ),
    (
        "project-workstation-user-setup.html",
        "fr/project-workstation-user-setup.html",
    ),
    ("it-support-resources.html", "fr/it-support-resources.html"),
    ("it-support-knowledge.html", "fr/it-support-knowledge.html"),
    (
        "project-data-cleaning-case-study.html",
        "fr/project-data-cleaning-case-study.html",
    ),
    (
        "project-portfolio-case-study.html",
        "fr/project-portfolio-case-study.html",
    ),
    (
        "project-sales-dashboard.html",
        "fr/project-sales-dashboard.html",
    ),
    (
        "windows-checks-before-it-support.html",
        "fr/windows-checks-before-it-support.html",
    ),
    (
        "suspicious-tech-support-pop-up.html",
        "fr/suspicious-tech-support-pop-up.html",
    ),
    (
        "windows-storage-full-safe-checks.html",
        "fr/windows-storage-full-safe-checks.html",
    ),
    (
        "windows-wifi-no-internet-safe-checks.html",
        "fr/windows-wifi-no-internet-safe-checks.html",
    ),
)

DETAILED_CASE_STUDY_PAGES = (
    "project-it-support-case-study.html",
    "project-network-printer-case-study.html",
    "project-workstation-user-setup.html",
    "project-data-cleaning-case-study.html",
    "project-portfolio-case-study.html",
    "project-sales-dashboard.html",
)

JSON_FILES = (
    "assets/data/projects.json",
    "assets/data/certifications.json",
)

CSS_FILES = (
    "assets/css/style.css",
    "assets/css/contact-assistant.css",
    "assets/css/pages.css",
    "assets/css/certifications.css",
    "assets/css/guide.css",
    "assets/css/knowledge.css",
    "assets/css/software-case-study.css",
)

SOCIAL_IMAGE_SPECS = {
    f"{SITE_ORIGIN}/assets/images/ui/og-image.png": (
        "assets/images/ui/og-image.png",
        "image/png",
        1200,
        627,
        750_000,
    ),
    **{
        f"{SITE_ORIGIN}/assets/images/social/{file_name}": (
            f"assets/images/social/{file_name}",
            "image/png",
            1200,
            630,
            100_000,
        )
        for file_name in (
            "certifications-fr.png",
            "certifications.png",
            "data-cleaning-fr.png",
            "data-cleaning.png",
            "home-fr.png",
            "home.png",
            "it-support-workflow-fr.png",
            "it-support-workflow.png",
            "network-printer-fr.png",
            "network-printer.png",
            "projects-fr.png",
            "projects.png",
            "sales-dashboard-fr.png",
            "sales-dashboard.png",
            "support-resources-fr.png",
            "support-resources.png",
            "workstation-setup-fr.png",
            "workstation-setup.png",
        )
    },
}


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
        self.anchor_links: list[dict[str, str | None]] = []
        self.images: list[dict[str, str | None]] = []
        self.blank_target_links: list[dict[str, str | None]] = []
        self.assistant_suggestions: list[dict[str, str | None]] = []
        self.alternate_links: dict[str, str] = {}
        self.canonical_url: str | None = None
        self.meta_properties: dict[str, str] = {}
        self.meta_names: dict[str, str] = {}
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
        elif tag == "meta":
            name = (attributes.get("name") or "").lower()
            property_name = (attributes.get("property") or "").lower()
            content = attributes.get("content")

            if name == "viewport":
                self.has_viewport = True
            if name and content is not None:
                self.meta_names[name] = content
            if property_name and content is not None:
                self.meta_properties[property_name] = content
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
        if tag == "a":
            self.anchor_links.append(attributes)

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


def read_image_metadata(
    relative_path: str,
    errors: list[str],
) -> tuple[str, int, int, int] | None:
    """Return MIME type, width, height, and byte size for PNG or JPEG assets."""
    path = ROOT / relative_path

    if not path.is_file():
        errors.append(f"{relative_path}: required social image is missing")
        return None

    data = path.read_bytes()

    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        if len(data) < 24 or data[12:16] != b"IHDR":
            errors.append(f"{relative_path}: invalid PNG header")
            return None
        width = int.from_bytes(data[16:20], "big")
        height = int.from_bytes(data[20:24], "big")
        return "image/png", width, height, len(data)

    if data.startswith(b"\xff\xd8"):
        offset = 2
        start_of_frame_markers = {
            0xC0,
            0xC1,
            0xC2,
            0xC3,
            0xC5,
            0xC6,
            0xC7,
            0xC9,
            0xCA,
            0xCB,
            0xCD,
            0xCE,
            0xCF,
        }

        while offset + 3 < len(data):
            if data[offset] != 0xFF:
                offset += 1
                continue

            while offset < len(data) and data[offset] == 0xFF:
                offset += 1
            if offset >= len(data):
                break

            marker = data[offset]
            offset += 1
            if marker in {0x01, *range(0xD0, 0xD9)}:
                continue
            if offset + 2 > len(data):
                break

            segment_length = int.from_bytes(data[offset : offset + 2], "big")
            if segment_length < 2 or offset + segment_length > len(data):
                break

            if marker in start_of_frame_markers and segment_length >= 7:
                height = int.from_bytes(data[offset + 3 : offset + 5], "big")
                width = int.from_bytes(data[offset + 5 : offset + 7], "big")
                return "image/jpeg", width, height, len(data)

            offset += segment_length

        errors.append(f"{relative_path}: JPEG dimensions could not be read")
        return None

    errors.append(f"{relative_path}: expected a PNG or JPEG social image")
    return None


def validate_social_previews(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    """Validate preview assets and Open Graph/Twitter metadata consistency."""
    asset_metadata: dict[str, tuple[str, int, int, int]] = {}

    for image_url, (
        relative_path,
        expected_mime,
        expected_width,
        expected_height,
        maximum_bytes,
    ) in SOCIAL_IMAGE_SPECS.items():
        metadata = read_image_metadata(relative_path, errors)
        if metadata is None:
            continue

        actual_mime, actual_width, actual_height, actual_bytes = metadata
        asset_metadata[image_url] = metadata
        add_error(
            errors,
            actual_mime == expected_mime,
            (
                f"{relative_path}: expected {expected_mime}, "
                f"found {actual_mime}"
            ),
        )
        add_error(
            errors,
            (actual_width, actual_height) == (
                expected_width,
                expected_height,
            ),
            (
                f"{relative_path}: expected {expected_width}x{expected_height}, "
                f"found {actual_width}x{actual_height}"
            ),
        )
        add_error(
            errors,
            actual_bytes <= maximum_bytes,
            (
                f"{relative_path}: social image is {actual_bytes} bytes; "
                f"maximum is {maximum_bytes}"
            ),
        )

    for page, parser in parsed_pages.items():
        properties = parser.meta_properties
        names = parser.meta_names
        image_url = properties.get("og:image")
        metadata = asset_metadata.get(image_url or "")

        add_error(
            errors,
            metadata is not None,
            f"{page}: og:image must reference an approved social image",
        )
        if metadata is None:
            continue

        mime_type, width, height, _ = metadata
        add_error(
            errors,
            (width, height) == (1200, 630),
            f"{page}: social preview must be 1200x630",
        )
        expected_metadata = {
            "og:image:type": mime_type,
            "og:image:width": str(width),
            "og:image:height": str(height),
        }
        for property_name, expected_value in expected_metadata.items():
            add_error(
                errors,
                properties.get(property_name) == expected_value,
                (
                    f"{page}: {property_name} must be "
                    f"{expected_value!r}"
                ),
            )

        add_error(
            errors,
            bool((properties.get("og:image:alt") or "").strip()),
            f"{page}: missing og:image:alt",
        )
        expected_locale = "fr_FR" if parser.language == "fr" else "en_US"
        alternate_locale = "en_US" if parser.language == "fr" else "fr_FR"
        for property_name in (
            "og:title",
            "og:description",
            "og:type",
            "og:site_name",
        ):
            add_error(
                errors,
                bool((properties.get(property_name) or "").strip()),
                f"{page}: missing {property_name}",
            )
        add_error(
            errors,
            properties.get("og:url") == parser.canonical_url,
            f"{page}: og:url must match the canonical URL",
        )
        add_error(
            errors,
            properties.get("og:locale") == expected_locale,
            f"{page}: og:locale must be {expected_locale!r}",
        )
        add_error(
            errors,
            properties.get("og:locale:alternate") == alternate_locale,
            f"{page}: og:locale:alternate must be {alternate_locale!r}",
        )
        add_error(
            errors,
            names.get("twitter:card") == "summary_large_image",
            f"{page}: twitter:card must be 'summary_large_image'",
        )
        add_error(
            errors,
            names.get("twitter:image") == image_url,
            f"{page}: twitter:image must match og:image",
        )
        add_error(
            errors,
            bool((names.get("twitter:image:alt") or "").strip()),
            f"{page}: missing twitter:image:alt",
        )
        for name in ("twitter:title", "twitter:description"):
            add_error(
                errors,
                bool((names.get(name) or "").strip()),
                f"{page}: missing {name}",
            )


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

    about_css = read_text("assets/css/about.css", errors)
    if about_css is not None:
        add_error(
            errors,
            "var(--border)" not in about_css and "var(--surface)" not in about_css,
            "assets/css/about.css: uses undefined legacy design tokens",
        )


def validate_css_architecture(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    expected_stylesheets = {
        "portfolio.html": (
            "assets/css/style.css",
            "assets/css/contact-assistant.css",
            "assets/css/pages.css",
        ),
        "fr/portfolio.html": (
            "../assets/css/style.css",
            "../assets/css/contact-assistant.css",
            "../assets/css/pages.css",
        ),
    }

    for page, stylesheets in expected_stylesheets.items():
        parser = parsed_pages.get(page)
        if parser is None:
            continue

        stylesheet_references = [
            reference
            for tag, reference in parser.references
            if tag == "link" and reference.endswith(".css")
        ]
        add_error(
            errors,
            all(stylesheet in stylesheet_references for stylesheet in stylesheets),
            f"{page}: required home-page stylesheets are incomplete",
        )
        if all(
            stylesheet in stylesheet_references for stylesheet in stylesheets
        ):
            add_error(
                errors,
                [
                    stylesheet_references.index(stylesheet)
                    for stylesheet in stylesheets
                ]
                == sorted(
                    stylesheet_references.index(stylesheet)
                    for stylesheet in stylesheets
                ),
                f"{page}: contact-assistant.css must load between shared "
                "style.css and pages.css",
            )

    for page, parser in parsed_pages.items():
        if page in expected_stylesheets:
            continue

        stylesheet_references = {
            reference
            for tag, reference in parser.references
            if tag == "link"
        }
        add_error(
            errors,
            not any(
                reference.endswith("contact-assistant.css")
                for reference in stylesheet_references
            ),
            f"{page}: home-page-only contact styles must not be loaded",
        )

    shared_source = read_text("assets/css/style.css", errors)
    contact_source = read_text("assets/css/contact-assistant.css", errors)

    if shared_source is not None:
        for selector in (".contact-section", ".assistant-launcher"):
            add_error(
                errors,
                selector not in shared_source,
                f"assets/css/style.css: home-page-only selector leaked into "
                f"the shared stylesheet: {selector}",
            )
        add_error(
            errors,
            len(shared_source.encode("utf-8")) <= 62_000,
            "assets/css/style.css: shared stylesheet exceeded the 62 KB "
            "size budget",
        )
        add_error(
            errors,
            "marqueeLeft" not in shared_source,
            "assets/css/style.css: automatic skills marquee motion must not "
            "be restored",
        )

    if contact_source is not None:
        for selector in (
            ".contact-section",
            ".contact-form",
            ".assistant-launcher",
            ".chat-assistant",
        ):
            add_error(
                errors,
                selector in contact_source,
                f"assets/css/contact-assistant.css: missing {selector} styles",
            )
        add_error(
            errors,
            bool(
                re.search(
                    r"\.chat-assistant\[hidden\]\s*\{"
                    r"[^}]*\bdisplay\s*:\s*none\s*;",
                    contact_source,
                    flags=re.DOTALL,
                )
            ),
            "assets/css/contact-assistant.css: hidden assistant must use "
            "display: none",
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
                        graph = structured_data.get("@graph")
                        if isinstance(graph, list):
                            for entity in graph:
                                if not isinstance(entity, dict):
                                    continue
                                entity_language = entity.get("inLanguage")
                                if isinstance(entity_language, str):
                                    structured_languages.append(entity_language)

                add_error(
                    errors,
                    expected_language in structured_languages,
                    f"{page}: JSON-LD inLanguage does not match the page language",
                )

    french_counterparts = {
        english_page: french_page
        for english_page, french_page in BILINGUAL_PAGE_PAIRS
    }
    for page, parser in parsed_pages.items():
        if PAGE_SPECS[page][1] != "fr":
            continue

        for attributes in parser.anchor_links:
            reference = attributes.get("href")
            if not reference:
                continue

            resolved = resolve_local_reference(page, reference)
            if resolved is None or resolved.suffix.lower() != ".html":
                continue

            try:
                target_page = resolved.relative_to(ROOT).as_posix()
            except ValueError:
                continue

            if (
                target_page in french_counterparts
                and (attributes.get("hreflang") or "").lower() != "en"
            ):
                errors.append(
                    f"{page}: silent French journey break to "
                    f"{target_page}; use "
                    f"{french_counterparts[target_page]} instead"
                )


def validate_quick_assistant(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    expected_intents = {
        "portfolio.html": Counter(
            {"opportunity": 2, "support": 1, "project": 1, "data": 1}
        ),
        "fr/portfolio.html": Counter(
            {"opportunity": 2, "support": 1, "project": 1, "data": 1}
        ),
    }
    expected_scripts = {
        "portfolio.html": (
            "assets/js/assistant-intents.js",
            "assets/js/contact-assistant.js",
            "assets/js/main.js",
        ),
        "fr/portfolio.html": (
            "../assets/js/assistant-intents.js",
            "../assets/js/contact-assistant.js",
            "../assets/js/main.js",
        ),
    }

    for page, scripts in expected_scripts.items():
        parser = parsed_pages.get(page)
        if parser is None:
            continue
        source = read_text(page, errors)
        if source is None:
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
            suggestion_intents == expected_intents[page],
            f"{page}: Quick Assistant suggestion intents are incomplete "
            f"({dict(suggestion_intents)})",
        )

        for suggestion in parser.assistant_suggestions:
            add_error(
                errors,
                bool((suggestion.get("data-message") or "").strip()),
                f"{page}: Quick Assistant suggestion has no prepared message",
            )

        assistant_tag_match = re.search(
            r'<section\b(?=[^>]*\bid="chatAssistant")[^>]*>',
            source,
            flags=re.DOTALL,
        )
        assistant_tag = (
            assistant_tag_match.group(0) if assistant_tag_match else ""
        )
        add_error(
            errors,
            bool(
                assistant_tag
                and re.search(r"\bhidden(?:\s|>)", assistant_tag)
                and re.search(r"\binert(?:\s|>)", assistant_tag)
                and re.search(
                    r'\baria-hidden\s*=\s*"true"',
                    assistant_tag,
                )
            ),
            f"{page}: closed Quick Assistant must start hidden, inert, and "
            "aria-hidden",
        )

        required_skill_headings = (
            {
                "IT Support &amp; Troubleshooting",
                "Software Development",
                "Data Analytics",
            }
            if page == "portfolio.html"
            else {
                "Support informatique et dépannage",
                "Développement logiciel",
                "Analyse de données",
            }
        )
        add_error(
            errors,
            source.count('class="skill-card ') == 3
            and all(heading in source for heading in required_skill_headings),
            f"{page}: skills section must contain three evidence-linked capability cards",
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
    workbench_source = read_text("assets/js/workbench.js", errors)

    if main_source is not None:
        add_error(
            errors,
            "assistantLauncher" not in main_source
            and "contactForm" not in main_source
            and "[data-workbench]" not in main_source
            and "workbenchScenarioSets" not in main_source,
            "assets/js/main.js: home-page-only logic leaked into the "
            "shared bundle",
        )
        add_error(
            errors,
            len(main_source.encode("utf-8")) <= 16_000,
            "assets/js/main.js: shared bundle exceeded the 16 KB size budget",
        )

    if contact_source is not None:
        required_contracts = (
            "contactForm",
            "copyEmail",
            "assistantLauncher",
            "QuickAssistantIntents",
            "setAssistantExposure",
            'setAttribute("aria-hidden"',
            'setAttribute("inert"',
            'removeAttribute("inert")',
        )
        for contract in required_contracts:
            add_error(
                errors,
                contract in contact_source,
                f"assets/js/contact-assistant.js: missing {contract} contract",
            )

    if workbench_source is not None:
        required_contracts = (
            "[data-workbench]",
            "[data-workbench-controls]",
            "[data-workbench-output]",
            "workbenchScenarioSets",
            "prefers-reduced-motion",
        )
        for contract in required_contracts:
            add_error(
                errors,
                contract in workbench_source,
                f"assets/js/workbench.js: missing {contract} contract",
            )
        add_error(
            errors,
            len(workbench_source.encode("utf-8")) <= 16_000,
            "assets/js/workbench.js: specialized bundle exceeded the "
            "16 KB size budget",
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
    validate_stat("Core Technology Pillars", len(set(project_categories)))
    validate_stat("Detailed Case Studies", len(DETAILED_CASE_STUDY_PAGES))

    homepage_pillars = {
        "portfolio.html": (
            'aria-label="Core technology capabilities"',
            "<strong>IT Support</strong>",
            'href="project-it-support-case-study.html"',
            "<strong>Software Development</strong>",
            'href="project-portfolio-case-study.html"',
            "<strong>Data Analytics</strong>",
            'href="project-data-cleaning-case-study.html"',
        ),
        "fr/portfolio.html": (
            'aria-label="Capacités technologiques principales"',
            "<strong>Support informatique</strong>",
            'href="project-it-support-case-study.html"',
            "<strong>Développement logiciel</strong>",
            'href="project-portfolio-case-study.html"',
            "<strong>Analyse de données</strong>",
            'href="project-data-cleaning-case-study.html"',
        ),
    }

    for page, required_markers in homepage_pillars.items():
        homepage = read_text(page, errors)
        if homepage is not None:
            add_error(
                errors,
                all(marker in homepage for marker in required_markers),
                f"{page}: hero must expose all three capability evidence paths",
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
    add_error(
        errors,
        not (ROOT / PRIVATE_STUDENT_RECORD).exists(),
        f"{PRIVATE_STUDENT_RECORD}: private student record must remain absent",
    )

    link_expectations = (
        ("portfolio.html", ENGLISH_CV, FRENCH_CV),
        ("fr/portfolio.html", f"../{FRENCH_CV}", f"../{ENGLISH_CV}"),
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


def validate_workbench(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    expected_scripts = {
        "portfolio.html": (
            "assets/js/workbench.js",
            "assets/js/main.js",
        ),
        "fr/portfolio.html": (
            "../assets/js/workbench.js",
            "../assets/js/main.js",
        ),
    }
    page_tokens = (
        "data-workbench",
        "data-workbench-controls",
        "data-workbench-output",
        'data-workbench-scenario="windows"',
        'data-workbench-scenario="network"',
        'data-workbench-scenario="setup"',
        "<noscript",
    )

    for page, scripts in expected_scripts.items():
        source = read_text(page, errors)
        if source is None:
            continue

        for token in page_tokens:
            add_error(
                errors,
                token in source,
                f"{page}: Workbench or no-JavaScript marker missing: {token}",
            )

        parser = parsed_pages.get(page)
        if parser is None:
            continue

        script_references = [
            reference
            for tag, reference in parser.references
            if tag == "script"
        ]
        workbench_script, main_script = scripts
        add_error(
            errors,
            workbench_script in script_references,
            f"{page}: Technical Workbench script is missing",
        )
        if (
            workbench_script in script_references
            and main_script in script_references
        ):
            add_error(
                errors,
                script_references.index(workbench_script)
                < script_references.index(main_script),
                f"{page}: workbench.js must load before main.js",
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
                reference.endswith("workbench.js")
                for reference in script_references
            ),
            f"{page}: home-page-only Workbench script must not be loaded",
        )

    javascript = read_text("assets/js/workbench.js", errors)
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
                f"assets/js/workbench.js: Workbench marker missing: {token}",
            )

        for route in (
            "project-network-printer-case-study.html",
            "project-workstation-user-setup.html",
        ):
            add_error(
                errors,
                javascript.count(f'href: "{route}"') == 2,
                f"assets/js/workbench.js: expected English and French "
                f"Workbench routes for {route}",
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


def validate_performance_budgets(errors: list[str]) -> None:
    """Keep shared front-end assets within low-bandwidth delivery budgets."""
    budgets = {
        "assets/css/style.css": 62_000,
        "assets/css/pages.css": 60_000,
        "assets/css/certifications.css": 10_000,
        "assets/css/contact-assistant.css": 20_000,
        "assets/css/knowledge.css": 10_000,
        "assets/css/software-case-study.css": 8_000,
        "assets/js/main.js": 20_000,
        "assets/js/conversion-analytics.js": 8_000,
        "assets/js/workbench.js": 20_000,
        "assets/js/contact-assistant.js": 25_100,
        "assets/js/assistant-intents.js": 6_000,
        "assets/images/profile/pacifique-profile.webp": 100_000,
    }

    for relative_path, maximum_bytes in budgets.items():
        path = ROOT / relative_path
        if not path.is_file():
            errors.append(f"{relative_path}: performance-budget asset is missing")
            continue

        actual_bytes = path.stat().st_size
        add_error(
            errors,
            actual_bytes <= maximum_bytes,
            (
                f"{relative_path}: {actual_bytes} bytes exceeds the "
                f"{maximum_bytes}-byte performance budget"
                    ),
                )


def validate_language_safe_navigation(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    """Prevent ordinary internal links from switching languages unexpectedly."""
    pair_by_page: dict[str, str] = {}
    for english_page, french_page in BILINGUAL_PAGE_PAIRS:
        pair_by_page[english_page] = french_page
        pair_by_page[french_page] = english_page

    for page, parser in parsed_pages.items():
        page_language = PAGE_SPECS[page][1]
        for anchor in parser.anchor_links:
            href = anchor.get("href")
            if not href:
                continue
            target = local_reference_repository_path(page, href)
            if target not in PAGE_SPECS:
                continue
            target_language = PAGE_SPECS[target][1]
            if target_language == page_language:
                continue
            is_explicit_switch = (
                pair_by_page.get(page) == target
                and anchor.get("lang") == target_language
                and anchor.get("hreflang") == target_language
            )
            add_error(
                errors,
                is_explicit_switch,
                (
                    f"{page}: internal link {href!r} changes language without "
                    "an explicit reciprocal language-switcher marker"
                ),
            )


def validate_knowledge_hub_navigation(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    """Keep the bilingual knowledge library reachable throughout the site."""
    for page, parser in parsed_pages.items():
        language = PAGE_SPECS[page][1]
        expected_hub = (
            "fr/it-support-knowledge.html"
            if language == "fr"
            else "it-support-knowledge.html"
        )
        targets = {
            local_reference_repository_path(page, anchor.get("href") or "")
            for anchor in parser.anchor_links
        }
        add_error(
            errors,
            expected_hub in targets,
            f"{page}: missing same-language IT support knowledge hub path",
        )

    for hub_page in (
        "it-support-knowledge.html",
        "fr/it-support-knowledge.html",
    ):
        source = read_text(hub_page, errors)
        if source is None:
            continue
        add_error(
            errors,
            source.count('class="knowledge-library__card"') == 4,
            f"{hub_page}: knowledge hub must contain four guide cards",
        )
        add_error(
            errors,
            all(
                f'id="{category}"' in source
                for category in (
                    "safe-checks",
                    "security",
                    "device-care",
                    "connectivity",
                )
            ),
            f"{hub_page}: knowledge hub category anchors are incomplete",
        )
        primary_navigation = re.search(
            r'<nav id="primaryNavigation"[\s\S]*?</nav>', source
        )
        add_error(
            errors,
            bool(primary_navigation)
            and 'class="active" href="projects.html"'
            not in primary_navigation.group(0),
            f"{hub_page}: Projects must not appear active on the knowledge hub",
        )


def validate_case_study_conversion_paths(
    parsed_pages: dict[str, PortfolioHTMLParser],
    errors: list[str],
) -> None:
    """Keep every bilingual case study connected to Projects and Contact."""
    case_studies = {
        page
        for pair in BILINGUAL_PAGE_PAIRS
        for page in pair
        if PurePosixPath(page).name.startswith("project-")
    }
    for page in sorted(case_studies):
        parser = parsed_pages.get(page)
        if parser is None:
            continue
        targets = {
            local_reference_repository_path(page, anchor.get("href") or "")
            for anchor in parser.anchor_links
        }
        directory = PurePosixPath(page).parent
        expected_projects = (directory / "projects.html").as_posix()
        expected_home = (directory / "portfolio.html").as_posix()
        add_error(
            errors,
            expected_projects in targets,
            f"{page}: case study is missing a same-language Projects path",
        )
        has_contact_path = any(
            local_reference_repository_path(page, anchor.get("href") or "")
            == expected_home
            and urlparse(anchor.get("href") or "").fragment == "contact"
            for anchor in parser.anchor_links
        )
        add_error(
            errors,
            has_contact_path,
            f"{page}: case study is missing a same-language Contact path",
        )


def validate_contact_form_recovery(errors: list[str]) -> None:
    """Require bilingual field errors and programmatic invalid-state recovery."""
    field_ids = (
        "contactName",
        "contactEmail",
        "contactSubject",
        "contactMessage",
    )

    for page in ("portfolio.html", "fr/portfolio.html"):
        source = read_text(page, errors)
        if source is None:
            continue

        add_error(
            errors,
            "novalidate" in source,
            f"{page}: contact form must use the accessible custom validation flow",
        )
        for field_id in field_ids:
            error_id = f"{field_id}Error"
            add_error(
                errors,
                f'aria-describedby="{error_id}"' in source,
                f"{page}: {field_id} must describe its inline error",
            )
            add_error(
                errors,
                f'id="{error_id}"' in source,
                f"{page}: missing inline error element {error_id}",
            )

    script = read_text("assets/js/contact-assistant.js", errors)
    if script is not None:
        for required_marker in (
            'setAttribute("aria-invalid"',
            "invalidFields[0].focus()",
            "errorsFound(invalidFields.length)",
            'addEventListener("blur"',
        ):
            add_error(
                errors,
                required_marker in script,
                (
                    "assets/js/contact-assistant.js: missing accessible "
                    f"form-recovery behavior {required_marker!r}"
                ),
            )


def validate_bilingual_component_parity(errors: list[str]) -> None:
    """Keep translated components structurally aligned with English sources."""
    english = read_text("portfolio.html", errors)
    french = read_text("fr/portfolio.html", errors)
    if english is None or french is None:
        return

    component_markers = (
        "skills",
        "featured-project-title",
        "education",
        "experience",
        "services",
        "contact",
        "chatAssistant",
    )

    def component_signature(source: str, marker: str) -> Counter[str]:
        section = re.search(
            rf'<section\b(?=[^>]*(?:id|aria-labelledby)="{marker}")[^>]*>.*?</section>',
            source,
            flags=re.DOTALL,
        )
        if section is None:
            return Counter()
        return Counter(re.findall(r"<([a-z][a-z0-9-]*)\b", section.group(0)))

    for marker in component_markers:
        english_signature = component_signature(english, marker)
        french_signature = component_signature(french, marker)
        add_error(
            errors,
            bool(english_signature)
            and english_signature == french_signature,
            (
                "fr/index.html: component structure does not match the English "
                f"homepage for {marker}"
            ),
        )

    english_projects = read_text("projects.html", errors)
    french_projects = read_text("fr/projects.html", errors)
    if english_projects is None or french_projects is None:
        return

    for marker in (
        "projects-page-title",
        "project-filter-title",
        "evidence-note-title",
        "featured-project-title",
        "all-projects-title",
        "project-roadmap-title",
        "projects-cta-title",
    ):
        english_signature = component_signature(english_projects, marker)
        french_signature = component_signature(french_projects, marker)
        add_error(
            errors,
            bool(english_signature)
            and english_signature == french_signature,
            (
                "fr/projects.html: component structure does not match the "
                f"English Projects page for {marker}"
            ),
        )
def validate_about_navigation_and_media(errors: list[str]) -> None:
    """Keep the bilingual personal profile discoverable and evidence-safe."""
    for page in PAGE_SPECS:
        source = read_text(page, errors)
        if source is None:
            continue
        primary_navigation = re.search(
            r'<nav id="primaryNavigation"[\s\S]*?</nav>', source
        )
        footer = re.search(r'<footer[\s\S]*?</footer>', source)
        expected_label = "À propos" if page.startswith("fr/") else "About"
        add_error(
            errors,
            bool(primary_navigation)
            and 'href="index.html"' in primary_navigation.group(0)
            and expected_label in primary_navigation.group(0),
            f"{page}: primary navigation is missing the locale-safe About link",
        )
        add_error(
            errors,
            bool(footer)
            and 'href="index.html"' in footer.group(0)
            and expected_label in footer.group(0),
            f"{page}: footer is missing the locale-safe About link",
        )

    for page in ("index.html", "fr/index.html"):
        source = read_text(page, errors)
        if source is None:
            continue
        expected_interaction_script = (
            "../assets/js/about-interactions.js"
            if page.startswith("fr/")
            else "assets/js/about-interactions.js"
        )
        add_error(
            errors,
            expected_interaction_script in source,
            f"{page}: accessible About journey interaction is missing",
        )
        portrait = re.search(r'<img[^>]+pacifique-profile\.webp[^>]+>', source)
        add_error(
            errors,
            bool(portrait)
            and bool(re.search(r'alt="[^\"]+"', portrait.group(0)))
            and 'width="1254"' in portrait.group(0)
            and 'height="1254"' in portrait.group(0),
            f"{page}: portrait needs descriptive alternative text and intrinsic dimensions",
        )
        add_error(
            errors,
            "April 2027" in source or "avril 2027" in source,
            f"{page}: degree-in-progress accuracy marker is missing",
        )


def validate_global_professional_identity(errors: list[str]) -> None:
    legacy_labels = (
        "IT Support Technician</small>",
        "Technicien en support informatique</small>",
        "Technicien support informatique</small>",
        "Technicien de support informatique</small>",
    )
    for page in PAGE_SPECS:
        source = read_text(page, errors)
        if source is None:
            continue
        expected_label = (
            "Professionnel des technologies numériques</small>"
            if page.startswith("fr/")
            else "Technology Professional</small>"
        )
        add_error(
            errors,
            expected_label in source and not any(label in source for label in legacy_labels),
            f"{page}: global professional identity is not three-pillar consistent",
        )


def validate_consent_first_analytics(errors: list[str]) -> None:
    """Guard the consent boundary and the fixed, non-personal About events."""
    analytics_path = ROOT / "assets/js/conversion-analytics.js"
    about_path = ROOT / "assets/js/about-interactions.js"
    if not analytics_path.is_file() or not about_path.is_file():
        errors.append("Consent-first analytics assets are missing")
        return

    analytics = analytics_path.read_text(encoding="utf-8")
    about = about_path.read_text(encoding="utf-8")
    required_analytics = (
        "portfolio-analytics-consent",
        'analytics_storage: "denied"',
        'analytics_storage: "granted"',
        "navigator.globalPrivacyControl",
        "navigator.doNotTrack",
        "location.origin}${location.pathname}",
        'data-analytics-consent="granted"',
        'data-analytics-consent="denied"',
    )
    for marker in required_analytics:
        add_error(errors, marker in analytics, f"conversion analytics: missing {marker}")

    add_error(
        errors,
        "location.href" not in analytics,
        "conversion analytics: complete URLs could expose query strings",
    )
    add_error(errors, "about_section_view" in about, "About analytics: missing about_section_view")

    for page, script_reference in (
        ("privacy.html", "assets/js/conversion-analytics.js"),
        ("fr/privacy.html", "../assets/js/conversion-analytics.js"),
    ):
        source = (ROOT / page).read_text(encoding="utf-8")
        for marker in (
            'data-analytics-consent="granted"',
            'data-analytics-consent="denied"',
            "data-analytics-status",
            script_reference,
        ):
            add_error(errors, marker in source, f"{page}: missing analytics choice control {marker}")


def main() -> int:
    errors: list[str] = []

    parsed_pages = parse_pages(errors)
    validate_social_previews(parsed_pages, errors)
    validate_references(parsed_pages, errors)
    validate_bilingual_pages(parsed_pages, errors)
    validate_language_safe_navigation(parsed_pages, errors)
    validate_knowledge_hub_navigation(parsed_pages, errors)
    validate_case_study_conversion_paths(parsed_pages, errors)
    validate_quick_assistant(parsed_pages, errors)
    validate_javascript_architecture(errors)
    validate_css_architecture(parsed_pages, errors)
    validate_css(errors)
    validate_json(errors)
    validate_project_catalog(errors)
    validate_recruiter_documents(errors)
    validate_sitemap(errors)
    validate_workbench(parsed_pages, errors)
    validate_protected_resources(errors)
    validate_performance_budgets(errors)
    validate_contact_form_recovery(errors)
    validate_bilingual_component_parity(errors)
    validate_about_navigation_and_media(errors)
    validate_global_professional_identity(errors)
    validate_consent_first_analytics(errors)
    smoke_test_routes(errors)

    if errors:
        print(f"Static portfolio validation failed with {len(errors)} error(s):")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        "Static portfolio validation passed: "
        f"{len(PAGE_SPECS)} pages, internal resources, accessibility markers, JSON-LD, "
        "JSON, XML, social previews, performance budgets, recruiter PDFs, "
        "protected resources, and HTTP routes."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

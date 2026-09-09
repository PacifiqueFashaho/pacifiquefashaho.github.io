"""Validate structural, content, privacy, and parity rules for CV candidates."""

from __future__ import annotations

import argparse
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

import pdfplumber
from pypdf import PdfReader


EXPECTED = {
    "en": {
        "lang": "en-US",
        "title": "Pacifique Fashaho - Professional CV",
        "subject": "Data analytics, artificial intelligence, IT systems, and automation",
        "headings": [
            "PROFESSIONAL PROFILE",
            "CORE CAPABILITIES",
            "PROFESSIONAL EXPERIENCE",
            "SELECTED PROJECT EVIDENCE",
            "VERIFIED PROFESSIONAL CREDENTIALS",
            "EDUCATION",
            "LANGUAGES AND WORKING ARRANGEMENTS",
        ],
        "facts": [
            "Data Analytics | Artificial Intelligence | IT Systems | Automation",
            "Cybercafé & Printing Center SMITH",
            "CAAP TUJITEGEMEE, NGO",
            "HIGH TECH BUSINESS",
            "Cybercafé KivuNet",
            "900 synthetic operational records",
            "840 accepted records",
            "60 rejected records",
            "66 defect events",
            "Microsoft IT Support Specialist Professional Certificate",
            "Microsoft, via Coursera | Completed September 8, 2026",
            "Expected April 2027",
            "State Diploma in General Pedagogy - 2024",
            "French - Very good | English - Very good",
        ],
        "credential_order": [
            "Microsoft IT Support Specialist Professional Certificate",
            "Google IT Support Professional Certificate",
            "Google Data Analytics Professional Certificate",
            "Python for Everybody",
        ],
        "forbidden": [
            r"\baspiring\b",
            r"\bbeginner\b",
            r"\bstudent\b",
            r"\binternship\b",
            r"learning project",
            r"INPP",
            r"WhatsApp",
            r"Python for Data Science, AI & Development",
            r"FIBAA",
            r"semester hours",
            r"credit recommendation",
            r"birth date",
        ],
    },
    "fr": {
        "lang": "fr-FR",
        "title": "Pacifique Fashaho - CV professionnel",
        "subject": "Analyse de données, intelligence artificielle, systèmes informatiques et automatisation",
        "headings": [
            "PROFIL PROFESSIONNEL",
            "CAPACITÉS CLÉS",
            "EXPÉRIENCE PROFESSIONNELLE",
            "PREUVES DE PROJETS SÉLECTIONNÉES",
            "CERTIFICATIONS PROFESSIONNELLES VÉRIFIÉES",
            "FORMATION",
            "LANGUES ET MODALITÉS DE TRAVAIL",
        ],
        "facts": [
            "Analyse de données | Intelligence artificielle | Systèmes informatiques | Automatisation",
            "Cybercafé & Printing Center SMITH",
            "CAAP TUJITEGEMEE, ONG",
            "HIGH TECH BUSINESS",
            "Cybercafé KivuNet",
            "900 enregistrements opérationnels synthétiques",
            "840 enregistrements acceptés",
            "60 rejetés",
            "66 événements de défaut",
            "Microsoft IT Support Specialist Professional Certificate",
            "Microsoft, via Coursera | Terminé le 8 septembre 2026",
            "Diplôme prévu en avril 2027",
            "Diplôme d'État en pédagogie générale - 2024",
            "Français - Très bon | Anglais - Très bon",
        ],
        "credential_order": [
            "Microsoft IT Support Specialist Professional Certificate",
            "Google IT Support Professional Certificate",
            "Google Data Analytics Professional Certificate",
            "Python for Everybody",
        ],
        "forbidden": [
            r"\baspirant(?:e)?\b",
            r"\bdébutant(?:e)?\b",
            r"\bétudiant(?:e)?\b",
            r"\bstage\b",
            r"projet d'apprentissage",
            r"INPP",
            r"WhatsApp",
            r"Python for Data Science, AI & Development",
            r"FIBAA",
            r"heures-semestre",
            r"recommandation de crédits",
            r"date de naissance",
        ],
    },
}

API_KEY = re.compile(r"sk-(?:proj-)?[A-Za-z0-9_-]{20,}")
PHONE = re.compile(r"(?<!\w)\+\s*\d(?:[\s().-]*\d){7,}(?!\w)")
LOCAL_PATH = re.compile(r"(?:[A-Za-z]:\\|file:///|/Users/|/home/)")
UUID = re.compile(
    r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b",
    re.IGNORECASE,
)
PRIVATE_TRANSCRIPT_EMAIL = re.compile(r"\bpacif\d+@gmail\.com\b", re.IGNORECASE)


def flattened_outline(items: list[object]) -> list[str]:
    result: list[str] = []
    for item in items:
        if isinstance(item, list):
            result.extend(flattened_outline(item))
        else:
            title = getattr(item, "title", "")
            if title:
                result.append(str(title))
    return result


def uri_annotations(reader: PdfReader) -> list[str]:
    uris: list[str] = []
    for page in reader.pages:
        for annotation_ref in page.get("/Annots") or []:
            annotation = annotation_ref.get_object()
            action = annotation.get("/A")
            if action:
                action = action.get_object()
                if action.get("/S") == "/URI":
                    uris.append(str(action.get("/URI") or ""))
    return uris


def link_rectangle_errors(reader: PdfReader) -> list[str]:
    errors: list[str] = []
    for page_number, page in enumerate(reader.pages, start=1):
        media_box = page.mediabox
        for annotation_ref in page.get("/Annots") or []:
            annotation = annotation_ref.get_object()
            action = annotation.get("/A")
            action = action.get_object() if action else {}
            if action.get("/S") != "/URI":
                continue
            rectangle = annotation.get("/Rect")
            if not rectangle or len(rectangle) != 4:
                errors.append(f"page {page_number} URI annotation has no rectangle")
                continue
            x1, y1, x2, y2 = (float(value) for value in rectangle)
            if x2 <= x1 or y2 <= y1:
                errors.append(f"page {page_number} URI annotation rectangle is empty")
            if (
                x1 < float(media_box.left) - 1
                or y1 < float(media_box.bottom) - 1
                or x2 > float(media_box.right) + 1
                or y2 > float(media_box.top) + 1
            ):
                errors.append(f"page {page_number} URI annotation is outside the page")
    return errors


def structure_roles(reader: PdfReader) -> Counter[str]:
    roles: Counter[str] = Counter()
    seen: set[tuple[int, int]] = set()

    def walk(reference: object) -> None:
        object_id = getattr(reference, "idnum", None)
        generation = getattr(reference, "generation", 0)
        if object_id is not None:
            key = (object_id, generation)
            if key in seen:
                return
            seen.add(key)
        try:
            value = reference.get_object()  # type: ignore[attr-defined]
        except AttributeError:
            value = reference
        if not isinstance(value, dict):
            return
        if value.get("/S"):
            roles[str(value["/S"])] += 1
        children = value.get("/K")
        if isinstance(children, list):
            for child in children:
                walk(child)
        elif children is not None and not isinstance(children, (int, float, str)):
            walk(children)

    walk(reader.trailer["/Root"]["/StructTreeRoot"])
    return roles


def font_checks(reader: PdfReader) -> tuple[int, list[str]]:
    checked: set[tuple[int | str, str]] = set()
    errors: list[str] = []
    for page in reader.pages:
        resources = page.get("/Resources")
        resources = resources.get_object() if resources else {}
        fonts = resources.get("/Font")
        fonts = fonts.get_object() if fonts else {}
        for name, reference in fonts.items():
            font = reference.get_object()
            key = (getattr(reference, "idnum", str(name)), str(font.get("/BaseFont")))
            if key in checked:
                continue
            checked.add(key)
            descendants = font.get("/DescendantFonts") or []
            descendant = descendants[0].get_object() if descendants else font
            descriptor = descendant.get("/FontDescriptor")
            descriptor = descriptor.get_object() if descriptor else {}
            if not any(item in descriptor for item in ("/FontFile", "/FontFile2", "/FontFile3")):
                errors.append(f"font is not embedded: {font.get('/BaseFont')}")
            if not font.get("/ToUnicode"):
                errors.append(f"font has no ToUnicode map: {font.get('/BaseFont')}")
    return len(checked), errors


def validate(path: Path, language: str) -> dict[str, object]:
    expected = EXPECTED[language]
    errors: list[str] = []
    reader = PdfReader(path)
    root = reader.trailer["/Root"]
    metadata = reader.metadata or {}

    with path.open("rb") as stream:
        if stream.read(8) != b"%PDF-1.7":
            errors.append("PDF header is not version 1.7")

    if reader.is_encrypted:
        errors.append("PDF is encrypted")
    if len(reader.pages) != 2:
        errors.append(f"expected 2 pages, found {len(reader.pages)}")
    if str(root.get("/Lang") or "") != expected["lang"]:
        errors.append(f"document language is not {expected['lang']}")
    mark_info = root.get("/MarkInfo")
    mark_info = mark_info.get_object() if mark_info else {}
    if not mark_info.get("/Marked"):
        errors.append("marked-PDF indicator is missing")
    if not root.get("/StructTreeRoot"):
        errors.append("structure tree is missing")
        roles: Counter[str] = Counter()
    else:
        roles = structure_roles(reader)
        required_roles = {
            "/Document": 1,
            "/H1": 1,
            "/H2": 8,
            "/H3": 10,
            "/P": 10,
            "/L": 9,
            "/LI": 22,
            "/Lbl": 22,
            "/Link": 12,
        }
        for role, minimum in required_roles.items():
            if roles[role] < minimum:
                errors.append(
                    f"structure role {role} found {roles[role]} times; expected at least {minimum}"
                )
    viewer = root.get("/ViewerPreferences")
    viewer = viewer.get_object() if viewer else {}
    if not viewer.get("/DisplayDocTitle"):
        errors.append("DisplayDocTitle is not enabled")
    if str(metadata.get("/Title") or "") != expected["title"]:
        errors.append("title metadata does not match")
    if str(metadata.get("/Author") or "") != "Pacifique Fashaho":
        errors.append("author metadata does not match")
    if str(metadata.get("/Subject") or "") != expected["subject"]:
        errors.append("subject metadata does not match")

    pypdf_pages = [(page.extract_text() or "").strip() for page in reader.pages]
    with pdfplumber.open(path) as document:
        plumber_pages = [(page.extract_text() or "").strip() for page in document.pages]
    if any(len(text) < 500 for text in pypdf_pages):
        errors.append("a page has unexpectedly little extractable text")
    pypdf_text = "\n".join(pypdf_pages)
    plumber_text = "\n".join(plumber_pages)
    normalized = re.sub(r"\s+", " ", pypdf_text)
    normalized_plumber = re.sub(r"\s+", " ", plumber_text)
    if "\ufffd" in pypdf_text or "\ufffd" in plumber_text:
        errors.append("replacement character found in extracted text")
    for heading in expected["headings"]:
        if heading not in normalized:
            errors.append(f"missing heading: {heading}")
    for fact in expected["facts"]:
        if fact not in normalized:
            errors.append(f"missing fact: {fact}")
        if fact not in normalized_plumber:
            errors.append(f"pdfplumber missing fact: {fact}")
    credential_positions = [
        normalized.find(title) for title in expected["credential_order"]
    ]
    if -1 in credential_positions or credential_positions != sorted(credential_positions):
        errors.append("credential evidence order does not match the approved hierarchy")
    for pattern in expected["forbidden"]:
        if re.search(pattern, normalized, re.IGNORECASE):
            errors.append(f"forbidden wording found: {pattern}")
    names = root.get("/Names") or {}
    names = names.get_object() if hasattr(names, "get_object") else names
    if names.get("/EmbeddedFiles"):
        errors.append("embedded files are present")
    if names.get("/JavaScript") or root.get("/OpenAction") or root.get("/AA"):
        errors.append("document-level action or JavaScript is present")
    if reader.get_fields():
        errors.append("unexpected form fields are present")

    uris = uri_annotations(reader)
    errors.extend(link_rectangle_errors(reader))
    if len(uris) != 12:
        errors.append(f"expected 12 URI annotations, found {len(uris)}")
    approved_hosts = {
        "pacifiquefashaho.me",
        "www.linkedin.com",
        "github.com",
        "www.credly.com",
        "www.coursera.org",
    }
    for uri in uris:
        parsed = urlparse(uri)
        if parsed.scheme == "mailto":
            if uri != "mailto:pacifiquefashaho04@gmail.com":
                errors.append("unapproved email link found")
        elif parsed.scheme != "https" or parsed.hostname not in approved_hosts:
            errors.append(
                f"unapproved link destination: {parsed.scheme}://{parsed.hostname or ''}"
            )
    microsoft_verification = (
        "https://www.coursera.org/account/accomplishments/professional-cert/"
        "INX0MLM37QFT"
    )
    if microsoft_verification not in uris:
        errors.append("Microsoft IT Support Specialist verification link is missing")

    font_count, font_errors = font_checks(reader)
    errors.extend(font_errors)
    if font_count < 3:
        errors.append(f"expected at least 3 embedded font faces, found {font_count}")

    scan_space = "\n".join(
        [normalized, *(str(value) for value in metadata.values()), *uris]
    )
    for label, pattern in (
        ("API key", API_KEY),
        ("phone number", PHONE),
        ("local path", LOCAL_PATH),
        ("private transcript email", PRIVATE_TRANSCRIPT_EMAIL),
    ):
        if pattern.search(scan_space):
            errors.append(f"prohibited {label} found")
    visible_and_metadata = "\n".join(
        [normalized, *(str(value) for value in metadata.values())]
    )
    if UUID.search(visible_and_metadata):
        errors.append("prohibited private transcript identifier found")

    outlines = flattened_outline(reader.outline or [])
    if len(outlines) < 6:
        errors.append(f"expected at least 6 outline entries, found {len(outlines)}")

    if errors:
        raise AssertionError(f"{path.name}:\n- " + "\n- ".join(errors))
    return {
        "file": path.name,
        "pages": len(reader.pages),
        "text_characters": len(pypdf_text),
        "uri_annotations": len(uris),
        "outline_entries": len(outlines),
        "font_count": font_count,
        "tagged": True,
        "language": expected["lang"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("english", type=Path)
    parser.add_argument("french", type=Path)
    args = parser.parse_args()
    results = [validate(args.english, "en"), validate(args.french, "fr")]
    for result in results:
        print(
            "{file}: {pages} pages, {text_characters} text characters, "
            "{uri_annotations} links, {outline_entries} outline entries, "
            "{font_count} embedded Unicode font faces, tagged, {language}".format(**result)
        )
    print("Accessible CV candidate validation passed for English and French.")


if __name__ == "__main__":
    main()

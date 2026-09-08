"""Normalize accessible CV PDF metadata without discarding Chromium tags."""

from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import BooleanObject, DictionaryObject, NameObject, TextStringObject


PROFILES = {
    "en": {
        "lang": "en-US",
        "title": "Pacifique Fashaho - Professional CV",
        "subject": "Data analytics, artificial intelligence, IT systems, and automation",
    },
    "fr": {
        "lang": "fr-FR",
        "title": "Pacifique Fashaho - CV professionnel",
        "subject": "Analyse de données, intelligence artificielle, systèmes informatiques et automatisation",
    },
}


def finalize(source: Path, destination: Path, language: str) -> None:
    profile = PROFILES[language]
    reader = PdfReader(source)
    if reader.is_encrypted:
        raise ValueError("Candidate PDF must not be encrypted")
    if "/StructTreeRoot" not in reader.trailer["/Root"]:
        raise ValueError("Candidate PDF has no structure tree; refusing to finalize it")

    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.pdf_header = "%PDF-1.7"
    writer.add_metadata(
        {
            "/Title": profile["title"],
            "/Author": "Pacifique Fashaho",
            "/Subject": profile["subject"],
            "/Keywords": profile["subject"],
            "/Creator": "Semantic HTML and Chromium tagged-PDF workflow",
        }
    )

    root = writer.root_object
    root[NameObject("/Lang")] = TextStringObject(profile["lang"])
    root[NameObject("/MarkInfo")] = DictionaryObject(
        {NameObject("/Marked"): BooleanObject(True)}
    )
    viewer_preferences = root.get("/ViewerPreferences")
    if viewer_preferences is None:
        viewer_preferences = DictionaryObject()
        root[NameObject("/ViewerPreferences")] = viewer_preferences
    else:
        viewer_preferences = viewer_preferences.get_object()
    viewer_preferences[NameObject("/DisplayDocTitle")] = BooleanObject(True)
    root[NameObject("/PageMode")] = NameObject("/UseOutlines")

    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as stream:
        writer.write(stream)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("language", choices=sorted(PROFILES))
    args = parser.parse_args()
    finalize(args.source, args.destination, args.language)


if __name__ == "__main__":
    main()

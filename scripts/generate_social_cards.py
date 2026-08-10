"""Generate deterministic Open Graph cards for the portfolio's public pages."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "images" / "social"
WIDTH, HEIGHT = 1200, 630

CARDS = {
    "home.png": ("ABOUT PACIFIQUE", "Technology, Learning & Life in Goma", "IT Support • Software Development • Data Analytics", "EN", "Technology Professional • Goma, DR Congo"),
    "home-fr.png": ("À PROPOS DE PACIFIQUE", "Technologie, apprentissage et parcours à Goma", "Support informatique • Développement logiciel • Analyse de données", "FR", "Professionnel des technologies numériques • Goma, RD Congo"),
    "projects.png": ("PROJECT PORTFOLIO", "Practical IT Support Projects", "Windows • Workstations • Networks • Printers", "EN"),
    "projects-fr.png": ("PORTFOLIO DE PROJETS", "Projets pratiques de support informatique", "Windows • Postes • Réseaux • Imprimantes", "FR"),
    "it-support-workflow.png": ("IT SUPPORT CASE STUDY", "Workstation Setup & Troubleshooting", "8-stage method • 6 validation checks", "EN"),
    "it-support-workflow-fr.png": ("ÉTUDE DE CAS — SUPPORT IT", "Configuration et dépannage d’un poste", "Méthode en 8 étapes • 6 vérifications", "FR"),
    "network-printer.png": ("IT SUPPORT CASE STUDY", "Network & Shared Printer Troubleshooting", "Layered diagnosis • Validation • Escalation", "EN"),
    "network-printer-fr.png": ("ÉTUDE DE CAS — SUPPORT IT", "Diagnostic réseau et imprimante partagée", "Diagnostic par couches • Validation • Escalade", "FR"),
    "workstation-setup.png": ("IT SUPPORT CHECKLIST", "New Workstation & User Setup", "Preparation • Acceptance • Handover", "EN"),
    "workstation-setup-fr.png": ("LISTE DE CONTRÔLE — SUPPORT IT", "Nouveau poste et configuration utilisateur", "Préparation • Validation • Remise", "FR"),
    "support-resources.png": ("PRINTABLE IT SUPPORT RESOURCES", "Practical Checklists for Safer Support", "Incident intake • Diagnosis • Handover • Escalation", "EN"),
    "support-resources-fr.png": ("RESSOURCES IMPRIMABLES — SUPPORT IT", "Listes pratiques pour un support plus sûr", "Incident • Diagnostic • Remise • Escalade", "FR"),
    "certifications.png": ("VERIFIED LEARNING EVIDENCE", "IT Support Certifications", "Google IT Support • Office tools • Complementary learning", "EN"),
    "certifications-fr.png": ("PREUVES DE FORMATION VÉRIFIÉES", "Certifications en support informatique", "Google IT Support • Bureautique • Formations complémentaires", "FR"),
    "data-cleaning.png": ("DATA ANALYTICS CASE STUDY", "Data Cleaning & Reporting Workflow", "7 quality issues • 6 validation checks", "EN"),
}


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / name), size)


def fit_text(
    draw: ImageDraw.ImageDraw,
    value: str,
    maximum: int,
    initial: int = 62,
    minimum: int = 38,
) -> ImageFont.FreeTypeFont:
    size = initial
    while size > minimum:
        candidate = font("segoeuib.ttf", size)
        if draw.textbbox((0, 0), value, font=candidate)[2] <= maximum:
            return candidate
        size -= 2
    return font("segoeuib.ttf", size)


def generate(
    filename: str,
    eyebrow: str,
    title: str,
    detail: str,
    language: str,
    role: str = "IT Support Technician • Goma, DR Congo",
) -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), "#071527")
    draw = ImageDraw.Draw(image)

    # Restrained blue support-workflow motif.
    draw.rounded_rectangle((46, 42, 1154, 588), radius=36, fill="#0b1d33", outline="#24476b", width=2)
    draw.ellipse((905, -150, 1315, 260), fill="#0d3157")
    draw.ellipse((980, -75, 1235, 180), fill="#145a96")
    draw.rounded_rectangle((76, 76, 94, 554), radius=9, fill="#3b82f6")

    eyebrow_font = font("segoeuib.ttf", 24)
    title_font = fit_text(draw, title, 900)
    detail_font = fit_text(draw, detail, 900, initial=29, minimum=20)
    brand_font = font("segoeuib.ttf", 26)
    role_font = fit_text(draw, role, 850, initial=22, minimum=18)
    badge_font = font("segoeuib.ttf", 18)

    draw.text((130, 112), eyebrow, font=eyebrow_font, fill="#73b7ff")
    draw.text((130, 188), title, font=title_font, fill="#f6f9fc")
    draw.text((132, 292), detail, font=detail_font, fill="#b8c8db")
    draw.line((132, 395, 1060, 395), fill="#24476b", width=2)
    draw.ellipse((132, 447, 148, 463), fill="#60a5fa")
    draw.text((168, 430), "Pacifique Fashaho", font=brand_font, fill="#f6f9fc")
    draw.text((168, 474), role, font=role_font, fill="#9db2c9")
    draw.rounded_rectangle((1042, 504, 1102, 544), radius=20, fill="#173b61")
    bbox = draw.textbbox((0, 0), language, font=badge_font)
    draw.text((1072 - (bbox[2] - bbox[0]) / 2, 513), language, font=badge_font, fill="#dbeafe")

    image.save(OUTPUT / filename, "PNG", optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, values in CARDS.items():
        generate(filename, *values)
    print(f"Generated {len(CARDS)} social cards in {OUTPUT}")


if __name__ == "__main__":
    main()

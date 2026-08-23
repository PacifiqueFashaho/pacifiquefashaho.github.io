from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
BLUE = colors.HexColor("#1F4E79")
ACCENT = colors.HexColor("#2B78C5")
TEXT = colors.HexColor("#202733")
MUTED = colors.HexColor("#586270")
LINE = colors.HexColor("#A9C7E6")
SOFT = colors.HexColor("#F4F8FC")


def register_fonts():
    candidates = [
        ("Arial", "C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/ariali.ttf"),
        ("DejaVuSans", "C:/Windows/Fonts/DejaVuSans.ttf", "C:/Windows/Fonts/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/DejaVuSans-Oblique.ttf"),
    ]
    for family, regular, bold, italic in candidates:
        if all(Path(path).exists() for path in (regular, bold, italic)):
            pdfmetrics.registerFont(TTFont(family, regular))
            pdfmetrics.registerFont(TTFont(f"{family}-Bold", bold))
            pdfmetrics.registerFont(TTFont(f"{family}-Italic", italic))
            return family
    return "Helvetica"


FONT = register_fonts()
BOLD = f"{FONT}-Bold" if FONT != "Helvetica" else "Helvetica-Bold"
ITALIC = f"{FONT}-Italic" if FONT != "Helvetica" else "Helvetica-Oblique"


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("Name", parent=base["Title"], fontName=BOLD, fontSize=22, leading=25, textColor=BLUE, alignment=TA_CENTER, spaceAfter=3),
        "position": ParagraphStyle("Position", parent=base["Normal"], fontName=BOLD, fontSize=10.5, leading=14, textColor=ACCENT, alignment=TA_CENTER, spaceAfter=6),
        "contact": ParagraphStyle("Contact", parent=base["Normal"], fontName=FONT, fontSize=8.3, leading=12, textColor=TEXT, alignment=TA_CENTER),
        "section": ParagraphStyle("Section", parent=base["Heading2"], fontName=BOLD, fontSize=11, leading=14, textColor=BLUE, spaceBefore=9, spaceAfter=5, borderWidth=0, borderPadding=0),
        "body": ParagraphStyle("Body", parent=base["BodyText"], fontName=FONT, fontSize=8.8, leading=12.3, textColor=TEXT, spaceAfter=3),
        "small": ParagraphStyle("Small", parent=base["BodyText"], fontName=FONT, fontSize=8.1, leading=11.2, textColor=TEXT),
        "role": ParagraphStyle("Role", parent=base["BodyText"], fontName=BOLD, fontSize=9.1, leading=12, textColor=BLUE),
        "meta": ParagraphStyle("Meta", parent=base["BodyText"], fontName=ITALIC, fontSize=8.1, leading=10.5, textColor=MUTED, spaceAfter=2),
        "bullet": ParagraphStyle("Bullet", parent=base["BodyText"], fontName=FONT, fontSize=8.4, leading=11.5, leftIndent=11, firstLineIndent=-6, bulletIndent=2, textColor=TEXT, spaceAfter=1.5),
        "skill_label": ParagraphStyle("SkillLabel", parent=base["BodyText"], fontName=BOLD, fontSize=8.5, leading=11, textColor=BLUE),
        "footer": ParagraphStyle("Footer", parent=base["BodyText"], fontName=FONT, fontSize=7.2, leading=9, alignment=TA_CENTER, textColor=MUTED),
    }


def section(title, s):
    return [Paragraph(title, s["section"]), Table([[""]], colWidths=[170 * mm], rowHeights=[0.35 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), LINE), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)])), Spacer(1, 3)]


def bullets(items, s):
    return [Paragraph(f"- {item}", s["bullet"]) for item in items]


def experience(role, dates, org, items, s):
    return KeepTogether([
        Table([[Paragraph(role, s["role"]), Paragraph(dates, s["small"])]], colWidths=[125 * mm, 45 * mm], style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("ALIGN", (1, 0), (1, 0), "RIGHT"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)])),
        Paragraph(org, s["meta"]),
        *bullets(items, s),
        Spacer(1, 3),
    ])


def build(path, lang):
    s = styles()
    fr = lang == "fr"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=20 * mm, leftMargin=20 * mm, topMargin=16 * mm, bottomMargin=16 * mm, title="CV - Pacifique Fashaho", author="Pacifique Fashaho")
    story = [
        Paragraph("PACIFIQUE FASHAHO", s["name"]),
        Paragraph("PROFESSIONNEL DES TECHNOLOGIES NUMÉRIQUES | SUPPORT INFORMATIQUE · DÉVELOPPEMENT LOGICIEL · ANALYSE DE DONNÉES" if fr else "TECHNOLOGY PROFESSIONAL | IT SUPPORT · SOFTWARE DEVELOPMENT · DATA ANALYTICS", s["position"]),
        Table([[""]], colWidths=[170 * mm], rowHeights=[0.5 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)])), Spacer(1, 5),
        Paragraph(("Goma, RD Congo | pacifiquefashaho04@gmail.com | pacifiquefashaho.me/fr/<br/>linkedin.com/in/pacifique-fashaho-8ab656388 | github.com/PacifiqueFashaho" if fr else "Goma, DR Congo | pacifiquefashaho04@gmail.com | pacifiquefashaho.me<br/>linkedin.com/in/pacifique-fashaho-8ab656388 | github.com/PacifiqueFashaho"), s["contact"]),
    ]

    story += section("PROFIL PROFESSIONNEL" if fr else "PROFESSIONAL SUMMARY", s)
    story.append(Paragraph(
        "Professionnel des technologies numériques avec une expérience vérifiée en support Windows, assistance aux utilisateurs, services numériques et qualité des données. Je développe également des interfaces web adaptatives et accessibles, et j’utilise Python, JavaScript, SQL et les tableurs pour des solutions et analyses ciblées. Bachelor of Science in Computer Science en cours, fin prévue en avril 2027." if fr else
        "Technology professional with verified experience supporting Windows systems, users, digital services, and data quality. I also build responsive, accessible web interfaces and use Python, JavaScript, SQL, and spreadsheets for focused solutions and analysis. Bachelor of Science in Computer Science in progress, expected April 2027.", s["body"]))

    story += section("COMPÉTENCES CLÉS" if fr else "CORE CAPABILITIES", s)
    skill_rows = [
        ("Support informatique" if fr else "IT Support", "Windows, dépannage matériel et logiciel, imprimantes, connectivité, configuration de postes, assistance et documentation" if fr else "Windows, hardware and software troubleshooting, printers, connectivity, workstation setup, user assistance, and documentation"),
        ("Développement logiciel" if fr else "Software Development", "HTML, CSS, JavaScript, Python, Git/GitHub, interfaces adaptatives, accessibilité et automatisation simple" if fr else "HTML, CSS, JavaScript, Python, Git/GitHub, responsive interfaces, accessibility, and focused automation"),
        ("Analyse de données" if fr else "Data Analytics", "Excel, Google Sheets, SQL, nettoyage, validation, rapports, tableaux de bord, KoBoToolbox et ODK" if fr else "Excel, Google Sheets, SQL, cleaning, validation, reports, dashboards, KoBoToolbox, and ODK"),
    ]
    story.append(Table([[Paragraph(a, s["skill_label"]), Paragraph(b, s["small"])] for a, b in skill_rows], colWidths=[40 * mm, 130 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), SOFT), ("GRID", (0, 0), (-1, -1), 0.35, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)])))

    story += section("EXPÉRIENCE PROFESSIONNELLE" if fr else "PROFESSIONAL EXPERIENCE", s)
    roles = [
        ("Technicien Support Informatique et Assistant des Services Numériques" if fr else "IT Support Technician & Digital Services Assistant", "Décembre 2025 - aujourd’hui" if fr else "December 2025 - Present", "Cybercafé & Printing Center SMITH - Goma, RD Congo", ["Assurer le support des ordinateurs, imprimantes, connexions Internet et applications bureautiques." if fr else "Provide support for computers, printers, Internet access, and office applications.", "Installer et maintenir Windows, pilotes, antivirus et logiciels de productivité." if fr else "Install and maintain Windows, drivers, antivirus tools, and productivity software.", "Dépanner les problèmes matériels, logiciels, réseau, d’impression et de numérisation." if fr else "Troubleshoot hardware, software, network, printing, and scanning issues."]),
        ("Enquêteur de terrain et appui technique" if fr else "Field Data Enumerator & Technical Support", "Juillet 2025 - novembre 2025" if fr else "July 2025 - November 2025", "CAAP TUJITEGEMEE, ONG - Goma, RD Congo", ["Collecter des données avec KoBoToolbox et ODK et assister les équipes terrain." if fr else "Collected field data with KoBoToolbox and ODK and supported field teams.", "Configurer les appareils et dépanner la connectivité sur le terrain." if fr else "Configured devices and troubleshot field connectivity issues.", "Nettoyer, valider et appuyer les contrôles de qualité et le reporting." if fr else "Cleaned and validated data and supported quality checks and reporting."]),
        ("Assistant Support Informatique et Données" if fr else "IT Support & Data Assistant", "Mars 2025 - juillet 2025" if fr else "March 2025 - July 2025", "HIGH TECH BUSINESS - Goma, RD Congo", ["Installer des ordinateurs, imprimantes et logiciels professionnels." if fr else "Installed computers, printers, and business software.", "Résoudre les incidents et appuyer les opérations techniques quotidiennes." if fr else "Resolved incidents and supported daily technical operations.", "Nettoyer et analyser des données et préparer des rapports et tableaux de bord." if fr else "Cleaned and analyzed data and prepared reports and dashboards."]),
    ]
    for role in roles:
        story.append(experience(*role, s))
    story.append(PageBreak())

    story += section("EXPÉRIENCE PROFESSIONNELLE - SUITE" if fr else "PROFESSIONAL EXPERIENCE - CONTINUED", s)
    story.append(experience("Assistant Informatique et Administratif" if fr else "IT & Administrative Assistant", "Juin 2024 - avril 2025" if fr else "June 2024 - April 2025", "Cybercafé KivuNet - Goma, RD Congo", ["Assurer le support informatique quotidien et le service aux utilisateurs." if fr else "Provided daily IT support and customer service for computer users.", "Maintenir Windows et dépanner Internet, l’impression, la numérisation et les postes." if fr else "Maintained Windows and troubleshot Internet, printing, scanning, and workstation issues.", "Aider pour les services en ligne, les fichiers et la préparation des documents." if fr else "Assisted with online services, file organization, and document preparation."], s))

    story += section("PROJETS SÉLECTIONNÉS - TROIS PILIERS" if fr else "SELECTED PROJECTS - THREE PILLARS", s)
    projects = [
        ("Support informatique - Processus de dépannage d’un poste" if fr else "IT Support - Workstation Troubleshooting Workflow", "Méthode représentative en huit étapes, du signalement à la validation et à la remise." if fr else "Representative eight-stage method from intake through validation and handoff."),
        ("Développement logiciel - Portfolio bilingue" if fr else "Software Development - Bilingual Portfolio Platform", "Produit web adaptatif et accessible avec HTML, CSS, JavaScript, SEO, contrôle de version et validation automatisée." if fr else "Responsive, accessible web product using HTML, CSS, JavaScript, SEO, version control, and automated validation."),
        ("Analyse de données - Nettoyage et reporting" if fr else "Data Analytics - Cleaning and Reporting Case Study", "Projet d’apprentissage clairement identifié couvrant nettoyage, validation, analyse structurée et reporting." if fr else "Clearly labelled learning project covering cleaning, validation, structured analysis, and reporting."),
    ]
    for title, desc in projects:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", s["body"]))

    story += section("FORMATION" if fr else "EDUCATION", s)
    story.append(Paragraph("<b>Bachelor of Science in Computer Science - En cours</b><br/><i>University of the People - En ligne | Fin prévue : avril 2027</i><br/>Études en programmation, bases de données, systèmes informatiques, réseaux, génie logiciel, développement web et données." if fr else "<b>Bachelor of Science in Computer Science - In Progress</b><br/><i>University of the People - Online | Expected completion: April 2027</i><br/>Studies include programming, databases, computer systems, networking, software engineering, web development, and data coursework.", s["body"]))

    story += section("CERTIFICATIONS" if fr else "CERTIFICATIONS", s)
    certs = ["Google IT Support Professional Certificate - Google | 1 avril 2026" if fr else "Google IT Support Professional Certificate - Google | April 1, 2026", "Google Data Analytics Professional Certificate - Google | 22 février 2026" if fr else "Google Data Analytics Professional Certificate - Google | February 22, 2026", "Python for Everybody - University of Michigan | 15 décembre 2025" if fr else "Python for Everybody - University of Michigan | December 15, 2025", "Qualification professionnelle en informatique bureautique - INPP | Octobre-décembre 2024" if fr else "Professional Qualification - Office Computing - INPP | October-December 2024"]
    story.extend(bullets(certs, s))

    story += section("INFORMATIONS COMPLÉMENTAIRES" if fr else "ADDITIONAL INFORMATION", s)
    story.extend(bullets((["Portfolio bilingue avec preuves publiées dans les trois disciplines", "Disponible pour des opportunités à distance ou sur site", "Références disponibles sur demande"] if fr else ["Bilingual portfolio with published evidence across all three disciplines", "Available for remote or on-site opportunities", "References available upon request"]), s))

    def footer(canvas, document):
        canvas.saveState()
        canvas.setFont(FONT, 7.2)
        canvas.setFillColor(MUTED)
        identity = "Professionnel des technologies numériques" if fr else "Technology Professional"
        canvas.drawCentredString(A4[0] / 2, 9 * mm, f"Pacifique Fashaho | {identity} | pacifiquefashaho.me")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build(ROOT / "Pacifique_Fashaho_CV.pdf", "en")
    build(ROOT / "Pacifique_Fashaho_CV_FR.pdf", "fr")

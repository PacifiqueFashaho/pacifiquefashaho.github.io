"""Synchronize the French Projects main layout with the English source page."""

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

TRANSLATIONS = {
    "Primary IT support evidence with complementary technical work": "Preuves principales en support informatique et travaux techniques complémentaires",
    "IT Support Projects &amp; Complementary Data Work": "Projets de support informatique et travaux complémentaires en données",
    "Start with a representative workstation troubleshooting method grounded in verified support experience. Data analytics, field data, and web projects remain available as complementary evidence.": "Commencez par une méthode représentative de dépannage d’un poste fondée sur une expérience vérifiée. Les projets de données, de terrain et web restent disponibles comme preuves complémentaires.",
    "&#x2B50; View IT Support Case Study": "&#x2B50; Voir l’étude de cas en support informatique",
    "&#x1F4BB; GitHub Profile": "&#x1F4BB; Profil GitHub",
    "Portfolio Projects": "Projets du portfolio",
    "Project Categories": "Catégories de projets",
    "Detailed Case Studies": "Études de cas détaillées",
    "Browse Projects": "Parcourir les projets",
    "Filter projects by category": "Filtrer les projets par catégorie",
    "All": "Tous",
    "IT Support": "Support informatique",
    "Data Analytics": "Analyse de données",
    "Web": "Web",
    "Field Data": "Données terrain",
    "No project is currently listed in this category.": "Aucun projet n’est actuellement répertorié dans cette catégorie.",
    "How Project Results Are Presented": "Comment les résultats des projets sont présentés",
    "The figures below describe verifiable project scope and published deliverables. Learning or simulated projects are identified clearly and are not presented as paid client work.": "Les chiffres ci-dessous décrivent une portée vérifiable et des livrables publiés. Les projets d’apprentissage ou simulés sont clairement identifiés et ne sont pas présentés comme des missions rémunérées.",
    "Featured Project": "Projet en vedette",
    "Primary IT support evidence with a transparent representative scope": "Preuve principale en support informatique avec une portée représentative transparente",
    "Workstation Setup &amp; Troubleshooting Workflow": "Processus de configuration et de dépannage d’un poste",
    "A representative method based on recurring support tasks involving Windows, hardware, software, printers, network connectivity, validation, and user documentation.": "Une méthode représentative fondée sur des tâches récurrentes concernant Windows, le matériel, les logiciels, les imprimantes, la connectivité, la validation et la documentation utilisateur.",
    "Hardware": "Matériel",
    "Printers": "Imprimantes",
    "Networking": "Réseau",
    "Problem": "Problème",
    "Workstation symptoms can affect Windows performance, hardware, printing, connectivity, and essential user tasks.": "Les symptômes d’un poste peuvent affecter Windows, le matériel, l’impression, la connectivité et les tâches essentielles.",
    "Tools": "Outils",
    "Windows utilities, hardware inspection, printer checks, IP and DNS diagnostics, and support documentation.": "Outils Windows, inspection matérielle, contrôles d’impression, diagnostics IP et DNS et documentation de support.",
    "Method": "Méthode",
    "Documented a reusable eight-stage sequence from issue intake and data protection through validation and handoff.": "Documentation d’une séquence réutilisable en huit étapes, du signalement et de la protection des données jusqu’à la validation et à la remise.",
    "Evidence boundary": "Limite de la preuve",
    "The workflow represents verified support capabilities without claiming one client incident, SLA, or guaranteed result.": "Le processus représente des compétences vérifiées sans revendiquer un incident client, un SLA ou un résultat garanti.",
    "Published evidence": "Preuve publiée",
    "1 detailed case-study page, 4 workflow areas, 8 method stages, and 6 example validation checks.": "1 étude de cas détaillée, 4 domaines de travail, 8 étapes et 6 exemples de validation.",
    "View IT Support Case Study": "Voir l’étude de cas en support informatique",
    "View Related Experience": "Voir l’expérience associée",
    "View Support Credentials": "Voir les certifications de support",
    "All Projects": "Tous les projets",
    "Practical work organized by problem, tools, actions, evidence, and result": "Travaux pratiques organisés par problème, outils, actions, preuves et résultat",
    "Network Connectivity &amp; Shared Printer Troubleshooting": "Dépannage de la connectivité réseau et d’une imprimante partagée",
    "Representative IT Support Workflow": "Processus représentatif de support informatique",
    "Shared Printers": "Imprimantes partagées",
    "Escalation": "Escalade",
    "A user cannot reach expected network services, discover a shared printer, or complete a print job.": "Un utilisateur ne peut pas accéder aux services réseau attendus, trouver une imprimante partagée ou terminer une impression.",
    "Adapter checks, ipconfig, ping, nslookup, printer queue, Print Spooler, driver, and test page.": "Contrôles de l’adaptateur, ipconfig, ping, nslookup, file d’impression, spouleur, pilote et page de test.",
    "Separates physical, local network, upstream, DNS, shared-access, and Windows printing layers.": "Sépare les couches physique, réseau local, accès amont, DNS, partage et impression Windows.",
    "A representative workflow, not a claim about one client, ticket, private network, or guaranteed resolution.": "Un processus représentatif, sans affirmation concernant un client, un ticket, un réseau privé ou une résolution garantie.",
    "View Network &amp; Printer Case Study": "Voir l’étude de cas réseau et imprimante",
    "Open Diagnostic Checklist": "Ouvrir la liste de diagnostic",
    "Category: IT Support": "Catégorie : Support informatique",
    "View project details": "Voir les détails du projet",
    "Eight diagnostic stages connect symptom intake, network-layer tests, printer checks, validation, documentation, and five clear escalation triggers.": "Huit étapes relient le signalement, les tests réseau, les contrôles d’impression, la validation, la documentation et cinq critères d’escalade.",
    "New Workstation &amp; User Setup": "Nouveau poste et configuration utilisateur",
    "Practical IT Support Checklist": "Liste pratique de support informatique",
    "Windows Setup": "Configuration Windows",
    "Drivers": "Pilotes",
    "User Handover": "Remise à l’utilisateur",
    "Documentation": "Documentation",
    "Objective": "Objectif",
    "Prepare a Windows workstation, validate essential functions, orient the user, and document handover.": "Préparer un poste Windows, valider les fonctions essentielles, orienter l’utilisateur et documenter la remise.",
    "Checks": "Contrôles",
    "Updates, drivers, approved applications, security, network, printer, folders, and backup location.": "Mises à jour, pilotes, applications approuvées, sécurité, réseau, imprimante, dossiers et emplacement de sauvegarde.",
    "Eight stages move from requirements and inspection through acceptance testing and user orientation.": "Huit étapes couvrent les besoins, l’inspection, les tests d’acceptation et l’orientation utilisateur.",
    "No enterprise deployment, Active Directory, Intune, Group Policy, domain, or client claim.": "Aucune affirmation concernant un déploiement d’entreprise, Active Directory, Intune, une stratégie de groupe, un domaine ou un client.",
    "View Workstation Setup Case Study": "Voir l’étude de cas sur la configuration",
    "Open Handover Checklist": "Ouvrir la liste de remise",
    "The checklist demonstrates practical local workstation preparation, six acceptance areas, user handover, documentation, privacy safeguards, and escalation boundaries.": "La liste démontre la préparation locale d’un poste, six domaines d’acceptation, la remise, la documentation, la confidentialité et les limites d’escalade.",
    "Sales Performance Dashboard": "Tableau de bord des performances commerciales",
    "Dashboard": "Tableau de bord",
    "KPIs": "Indicateurs",
    "Reporting": "Rapports",
    "Sales information needed to be summarized quickly for review and reporting.": "Les données commerciales devaient être résumées rapidement pour leur examen et leur présentation.",
    "Excel, charts, KPI cards, GitHub.": "Excel, graphiques, cartes d’indicateurs et GitHub.",
    "What I did": "Ce que j’ai réalisé",
    "Built a dashboard structure with performance indicators and visual summaries.": "Création d’un tableau de bord avec des indicateurs de performance et des synthèses visuelles.",
    "Result": "Résultat",
    "A dashboard that makes sales performance easier to understand and share.": "Un tableau de bord qui facilite la compréhension et le partage des performances commerciales.",
    "4 accessible deliverables: case-study page, repository, PDF dashboard, and Excel workbook.": "4 livrables accessibles : étude de cas, dépôt, tableau de bord PDF et classeur Excel.",
    "View Case Study": "Voir l’étude de cas",
    "View Repository": "Voir le dépôt",
    "Category: Data Analytics": "Catégorie : Analyse de données",
    "This project demonstrates dashboard structure, KPI thinking, reporting layout, and professional project publishing through GitHub.": "Ce projet démontre la structuration d’un tableau de bord, le choix d’indicateurs, la présentation des rapports et la publication professionnelle sur GitHub.",
    "Personal Portfolio Website": "Site portfolio professionnel",
    "My skills, experience, certifications, and projects needed one professional online presence.": "Mes compétences, expériences, certifications et projets avaient besoin d’une présence professionnelle unique en ligne.",
    "HTML, CSS, JavaScript, Git, GitHub Pages.": "HTML, CSS, JavaScript, Git et GitHub Pages.",
    "Built a responsive multi-page portfolio with animations, filters, dark mode, and SEO metadata.": "Création d’un portfolio responsive multipage avec animations, filtres, mode sombre et métadonnées SEO.",
    "A maintainable professional portfolio that showcases my technical profile and work.": "Un portfolio professionnel maintenable présentant mon profil technique et mes travaux.",
    "Measurable scope": "Portée mesurable",
    "4 public pages, 2 visual themes, 4 project filters, and 1 responsive codebase published with GitHub Pages.": "4 pages publiques, 2 thèmes visuels, 4 filtres de projets et 1 base de code responsive publiée avec GitHub Pages.",
    "Visit Live Site": "Voir le site",
    "Category: Web": "Catégorie : Web",
    "The portfolio includes structured navigation, dedicated project and certification pages, accessibility improvements, responsive layout, theme switching, project filtering, and professional metadata.": "Le portfolio comprend une navigation structurée, des pages dédiées, des améliorations d’accessibilité, une mise en page responsive, des thèmes, des filtres et des métadonnées professionnelles.",
    "Data Cleaning &amp; Reporting Case Study": "Étude de cas sur le nettoyage et le reporting des données",
    "Data Cleaning": "Nettoyage de données",
    "Insights": "Analyses",
    "Raw data becomes valuable only when cleaned, analyzed, and communicated clearly.": "Les données brutes deviennent utiles lorsqu’elles sont nettoyées, analysées et communiquées clairement.",
    "SQL, Excel, Google Sheets, data cleaning workflow, visualization concepts.": "SQL, Excel, Google Sheets, processus de nettoyage et concepts de visualisation.",
    "Applied a structured workflow to profile, clean, validate, analyze, and communicate data.": "Application d’un processus structuré pour profiler, nettoyer, valider, analyser et communiquer les données.",
    "Created a transparent method for converting inconsistent records into a validated, report-ready structure.": "Création d’une méthode transparente pour convertir des enregistrements incohérents en une structure validée prête pour le reporting.",
    "7 data-quality issue types, 6 analytics stages, and 6 validation checks documented in the detailed case study.": "7 types de problèmes de qualité, 6 étapes d’analyse et 6 contrôles documentés dans l’étude détaillée.",
    "View Data Cleaning Case Study": "Voir l’étude de cas sur le nettoyage",
    "View Certificate": "Voir le certificat",
    "Verify Credential": "Vérifier la certification",
    "This representative practice case documents data profiling, cleaning rules, validation controls, analysis preparation, reporting outputs, and ethical limitations.": "Ce cas pratique documente le profilage, les règles de nettoyage, les contrôles, la préparation de l’analyse, les rapports et les limites éthiques.",
    "KoBoToolbox / ODK Field Data Support": "Support des données terrain avec KoBoToolbox / ODK",
    "Tablets": "Tablettes",
    "Validation": "Validation",
    "Field teams need dependable mobile data collection, device setup, connectivity support, and quality checks.": "Les équipes terrain ont besoin d’une collecte mobile fiable, d’appareils configurés, d’un support de connectivité et de contrôles qualité.",
    "KoBoToolbox, ODK, tablets, Excel, Google Sheets, data validation.": "KoBoToolbox, ODK, tablettes, Excel, Google Sheets et validation des données.",
    "Collected digital field data, configured mobile devices, supported field teams, and checked dataset quality.": "Collecte de données numériques, configuration des appareils, assistance aux équipes et contrôle de la qualité.",
    "Cleaner field datasets and stronger technical continuity during data collection activities.": "Des jeux de données plus propres et une meilleure continuité technique pendant la collecte.",
    "Documented scope": "Portée documentée",
    "5 workflow areas covered: form use, mobile-device setup, field-team support, validation, and reporting preparation.": "5 domaines couverts : formulaires, appareils mobiles, équipes terrain, validation et préparation des rapports.",
    "Category: Field Data": "Catégorie : Données terrain",
    "This project is based on practical field data collection and technical support experience using mobile data collection tools.": "Ce projet repose sur une expérience pratique de collecte et de support technique avec des outils mobiles.",
    "Project Development Roadmap": "Feuille de route des projets",
    "I am continuing to improve this portfolio by adding deeper project documentation, screenshots, source files, and case studies.": "Je continue d’améliorer ce portfolio avec une documentation plus approfondie, des captures, des fichiers sources et des études de cas.",
    "More IT Support Documentation": "Plus de documentation de support informatique",
    "Workflows, checklists, and troubleshooting examples": "Processus, listes de contrôle et exemples de dépannage",
    "I will document practical workflows for workstation setup, printer support, networking, and user assistance.": "Je documenterai des processus pratiques pour les postes, les imprimantes, le réseau et l’assistance utilisateur.",
    "Complementary Data Projects": "Projets complémentaires en données",
    "Dashboards, cleaning workflows, and analytics cases": "Tableaux de bord, nettoyage et cas d’analyse",
    "I plan to publish more data projects using Excel, SQL, Python, and dashboard screenshots.": "Je prévois de publier davantage de projets avec Excel, SQL, Python et des captures de tableaux de bord.",
    "Field Data Examples": "Exemples de données terrain",
    "KoBoToolbox, ODK, validation, and reporting": "KoBoToolbox, ODK, validation et reporting",
    "I will add safe, non-sensitive examples of field data collection and quality control workflows.": "J’ajouterai des exemples non sensibles de collecte et de contrôle qualité.",
    "Web Improvements": "Améliorations web",
    "Accessibility, performance, SEO, and maintainability": "Accessibilité, performance, SEO et maintenabilité",
    "This portfolio itself is an active project where I improve layout, code quality, and user experience.": "Ce portfolio est un projet actif dont j’améliore la mise en page, la qualité du code et l’expérience utilisateur.",
    "Interested in Working Together?": "Intéressé par une collaboration ?",
    "I can support organizations with workstation troubleshooting, user support, data cleaning, dashboards, reporting, and field data tools. I am open to remote and on-site opportunities.": "Je peux accompagner les organisations pour le dépannage des postes, l’assistance utilisateur, le nettoyage des données, les tableaux de bord, les rapports et les outils terrain. Je suis disponible à distance ou sur site.",
    "Contact Me": "Me contacter",
    "View GitHub": "Voir GitHub",
}


def translate_text_nodes(html: str) -> str:
    def replace(match: re.Match[str]) -> str:
        value = match.group(1)
        stripped = " ".join(value.split())
        translated = TRANSLATIONS.get(stripped)
        if translated is None:
            return match.group(0)
        leading = value[: len(value) - len(value.lstrip())]
        trailing = value[len(value.rstrip()) :]
        return f">{leading}{translated}{trailing}<"

    return re.sub(r">([^<>]+)<", replace, html, flags=re.DOTALL)


def localize_paths(html: str) -> str:
    html = re.sub(r'(?P<attr>src|href)="assets/', r'\g<attr>="../assets/', html)
    for page in ("project-sales-dashboard.html", "project-data-cleaning-case-study.html"):
        html = html.replace(f'href="{page}"', f'href="../{page}" lang="en" hreflang="en"')
    return html


def main() -> None:
    english = (ROOT / "projects.html").read_text(encoding="utf-8")
    french_path = ROOT / "fr" / "projects.html"
    french = french_path.read_text(encoding="utf-8")
    english_main = re.search(r"  <main\b.*?</main>", english, flags=re.DOTALL)
    if english_main is None:
        raise RuntimeError("English projects main content was not found")

    localized_main = localize_paths(translate_text_nodes(english_main.group(0)))
    updated, count = re.subn(
        r"  <main\b.*?</main>",
        lambda _: localized_main,
        french,
        count=1,
        flags=re.DOTALL,
    )
    if count != 1:
        raise RuntimeError("French projects main content was not found")
    french_path.write_text(updated, encoding="utf-8")
    print("French Projects page synchronized with the English component layout")


if __name__ == "__main__":
    main()

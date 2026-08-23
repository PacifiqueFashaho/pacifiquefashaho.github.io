"""Create the missing French case studies from their English counterparts."""

from __future__ import annotations

import html
import json
import re
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    "project-sales-dashboard.html",
    "project-data-cleaning-case-study.html",
)

META_OVERRIDES = {
    "project-data-cleaning-case-study.html": {
        "title": "Nettoyage de données : étude de cas | Pacifique Fashaho",
        "description": "Étude de cas pratique sur le nettoyage de données : valeurs manquantes, doublons, normalisation, contrôles de qualité et reporting.",
        "social_description": "Méthode pratique pour nettoyer, valider et préparer des données fiables pour le reporting.",
    },
    "project-sales-dashboard.html": {
        "title": "Tableau de bord Excel : étude de cas | Pacifique Fashaho",
        "description": "Étude de cas d’un tableau de bord Excel présentant KPI commerciaux, tendances, structure du reporting et visualisation des performances.",
        "social_description": "Tableau de bord Excel avec KPI commerciaux, tendances et présentation claire des performances.",
    },
}

CACHE: dict[str, str] = {
    "Home": "Accueil",
    "Projects": "Projets",
    "Skills": "Compétences",
    "Experience": "Expérience",
    "Services": "Services",
    "Contact Me": "Me contacter",
    "Portfolio": "Portfolio",
    "Professional": "Professionnel",
    "Email": "E-mail",
    "Theme": "Thème",
    "Menu": "Menu",
    "Back to top": "Retour en haut",
    "Skip to content": "Aller au contenu",
    "Primary navigation": "Navigation principale",
    "Language selection": "Sélection de la langue",
    "Project status": "Statut du projet",
    "Practice project": "Projet pratique",
}


def translate(text: str) -> str:
    clean = " ".join(html.unescape(text).split())
    if not clean or not re.search(r"[A-Za-z]", clean):
        return clean
    if clean in CACHE:
        return CACHE[clean]
    query = urllib.parse.urlencode(
        {"client": "gtx", "sl": "en", "tl": "fr", "dt": "t", "q": clean}
    )
    with urllib.request.urlopen(
        f"https://translate.googleapis.com/translate_a/single?{query}", timeout=20
    ) as response:
        payload = json.loads(response.read().decode("utf-8"))
    result = "".join(part[0] for part in payload[0] if part[0]).strip()
    CACHE[clean] = result
    time.sleep(0.04)
    return result


def translate_text_nodes(source: str) -> str:
    protected: list[str] = []

    def protect(match: re.Match[str]) -> str:
        protected.append(match.group(0))
        return f"@@PROTECTED_{len(protected) - 1}@@"

    source = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", protect, source, flags=re.I | re.S)
    tokens = re.split(r"(<[^>]+>)", source)
    output: list[str] = []
    for token in tokens:
        if token.startswith("<") or token.startswith("@@PROTECTED_"):
            output.append(token)
            continue
        leading = re.match(r"^\s*", token).group(0)
        trailing = re.search(r"\s*$", token).group(0)
        core = token[len(leading) : len(token) - len(trailing) if trailing else None]
        if core and re.search(r"[A-Za-z]", html.unescape(core)):
            output.append(leading + html.escape(translate(core), quote=False) + trailing)
        else:
            output.append(token)
    result = "".join(output)
    for index, block in enumerate(protected):
        result = result.replace(f"@@PROTECTED_{index}@@", block)
    return result


def translate_attributes(source: str) -> str:
    pattern = re.compile(r'\b(aria-label|alt|title)="([^"]+)"')

    def replacement(match: re.Match[str]) -> str:
        return f'{match.group(1)}="{html.escape(translate(match.group(2)), quote=True)}"'

    return pattern.sub(replacement, source)


def localize_page(filename: str) -> str:
    source = (ROOT / filename).read_text(encoding="utf-8")
    source = re.sub(r'^\s*<link rel="alternate"[^>]+/>\s*$', "", source, flags=re.M)
    source = re.sub(
        r'\s*<div class="language-switcher"[^>]*>.*?</div>\s*',
        "\n\n",
        source,
        count=1,
        flags=re.S,
    )
    result = translate_text_nodes(source)
    result = translate_attributes(result)
    result = result.replace('<html lang="en">', '<html lang="fr">')
    result = re.sub(r'(<meta name="description"\s+content=")([^"]+)', lambda m: m.group(1) + html.escape(translate(m.group(2)), quote=True), result)
    result = re.sub(r'(<meta name="keywords"\s+content=")([^"]+)', lambda m: m.group(1) + html.escape(translate(m.group(2)), quote=True), result)
    result = re.sub(r'(<meta (?:property|name)="(?:og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)"\s+content=")([^"]+)', lambda m: m.group(1) + html.escape(translate(m.group(2)), quote=True), result)

    result = re.sub(r'(?<=href=")assets/', '../assets/', result)
    result = re.sub(r'(?<=src=")assets/', '../assets/', result)
    result = re.sub(r'(?<=href=")index\.html', 'index.html', result)
    result = re.sub(r'(?<=href=")projects\.html', 'projects.html', result)
    result = re.sub(r'(?<=href=")certifications\.html', 'certifications.html', result)
    result = result.replace(
        'href="Pacifique_Fashaho_CV.pdf"',
        'href="../Pacifique_Fashaho_CV_FR.pdf"',
    )
    result = result.replace('src="assets/js/', 'src="../assets/js/')

    english_url = f"https://pacifiquefashaho.me/{filename}"
    french_url = f"https://pacifiquefashaho.me/fr/{filename}"
    result = result.replace(english_url, french_url)
    result = result.replace('<meta property="og:locale" content="en_US" />', '<meta property="og:locale" content="fr_FR" />\n  <meta property="og:locale:alternate" content="en_US" />')

    alternates = (
        f'  <link rel="alternate" hreflang="en" href="{english_url}" />\n'
        f'  <link rel="alternate" hreflang="fr" href="{french_url}" />\n'
        f'  <link rel="alternate" hreflang="x-default" href="{english_url}" />\n'
    )
    result = re.sub(r'(  <link rel="canonical"[^>]+/>\n)', r'\1' + alternates, result, count=1)

    switcher = (
        f'      <div class="language-switcher" aria-label="Sélection de la langue">\n'
        f'        <a href="../{filename}" lang="en" hreflang="en">EN</a>'
        f'<span class="language-switcher-separator" aria-hidden="true">/</span>\n'
        f'        <a href="{filename}" lang="fr" hreflang="fr" aria-current="page">FR</a>\n'
        f'      </div>\n\n'
    )
    result = re.sub(
        r'\n\s*<button\n\s*class="theme-toggle"',
        "\n\n" + switcher + '      <button\n        class="theme-toggle"',
        result,
        count=1,
    )
    result = result.replace('<body>', '<body class="case-study-page">', 1)
    if '"inLanguage": "en"' in result:
        result = result.replace('"inLanguage": "en"', '"inLanguage": "fr"', 1)
    elif '"inLanguage"' not in result:
        result = result.replace('"isPartOf": {', '"inLanguage": "fr",\n    "isPartOf": {', 1)
    refinements = {
        "Tableau de bord des performances des ventes": "Tableau de bord des performances commerciales",
        "Étude de cas du tableau de bord des performances des ventes": "Étude de cas du tableau de bord des performances commerciales",
        "Nettoyage des données et rapports": "Nettoyage et reporting des données",
        "Sortie du rapport": "Livrables de reporting",
        "Leçons apprises": "Enseignements tirés",
        "Voir le référentiel": "Voir le dépôt",
        "Actifs publiés": "Livrables publiés",
        "Aperçu visuel de la sortie du tableau de bord des ventes": "Aperçu visuel du tableau de bord commercial",
        "But": "Objectif",
        "Public": "Public cible",
        "Sortir": "Livrable",
        "Créez un tableau de bord Excel clair": "Créer un tableau de bord Excel clair",
        "dans un format lisible et convivial": "dans un format lisible et adapté à la prise de décision",
        "Préparer et structurer le cahier d'exercices": "Préparer et structurer le classeur",
        "Identifiez quelles informations doivent être faciles à examiner": "Identifier les informations qui doivent être consultées rapidement",
        "Considéré ce qu'un utilisateur professionnel voudrait comprendre rapidement.": "Prise en compte des informations qu’un utilisateur professionnel doit comprendre rapidement.",
        "Preuve du portefeuille": "Preuve pour le portfolio",
        "Pensez du point de vue de l’utilisateur": "Penser du point de vue de l’utilisateur",
        "Discutez d'un projet de données": "Discuter d’un projet de données",
        "prêtes à être rapportées": "prêtes pour le reporting",
        "sans présenter le travail simulé comme un engagement client": "sans présenter ce travail simulé comme une mission client",
        "les majuscules mixtes": "une casse incohérente",
        "chaque domaine": "chaque champ",
        "Excel/Google Feuilles": "Excel / Google Sheets",
        "Demander": "Questionner",
        "Processus": "Traiter",
        "Acte": "Agir",
        "Communiquez les résultats": "Communiquer les résultats",
        "Convertissez les résultats": "Convertir les résultats",
        "Revérification en double": "Nouveau contrôle des doublons",
        "l'espacement et la majuscule": "les espaces et la casse",
        "Ils ne sont pas présentés": "Ces chiffres ne sont pas présentés",
        "Effacez les totaux, les distributions": "Présenter clairement les totaux, les distributions",
        ">Exceller<": ">Excel<",
        ">Feuilles Google<": ">Google Sheets<",
        ">Examen en double<": ">Analyse des doublons<",
        ">Rapports<": ">Reporting<",
        "Vérifier les informations d'identification": "Vérifier la certification",
    }
    for automatic, preferred in refinements.items():
        result = result.replace(automatic, preferred)
    metadata = META_OVERRIDES[filename]
    result = re.sub(
        r"<title>.*?</title>",
        f"<title>{metadata['title']}</title>",
        result,
        count=1,
        flags=re.S,
    )
    result = re.sub(
        r'(<meta\s+name="description"\s+content=")[^"]+',
        lambda match: match.group(1) + metadata["description"],
        result,
        count=1,
        flags=re.S,
    )
    for property_name in ("og:title", "twitter:title"):
        result = re.sub(
            rf'(<meta\s+(?:property|name)="{property_name}"\s+content=")[^"]+',
            lambda match: match.group(1) + metadata["title"],
            result,
            count=1,
            flags=re.S,
        )
    for property_name in ("og:description", "twitter:description"):
        result = re.sub(
            rf'(<meta\s+(?:property|name)="{property_name}"\s+content=")[^"]+',
            lambda match: match.group(1) + metadata["social_description"],
            result,
            count=1,
            flags=re.S,
        )
    return result


def add_english_alternates(filename: str) -> None:
    path = ROOT / filename
    source = path.read_text(encoding="utf-8")
    english_url = f"https://pacifiquefashaho.me/{filename}"
    french_url = f"https://pacifiquefashaho.me/fr/{filename}"
    if 'hreflang="fr"' not in source:
        links = (
            f'  <link rel="alternate" hreflang="en" href="{english_url}" />\n'
            f'  <link rel="alternate" hreflang="fr" href="{french_url}" />\n'
            f'  <link rel="alternate" hreflang="x-default" href="{english_url}" />\n'
        )
        source = re.sub(r'(  <link rel="canonical"[^>]+/>\n)', r'\1' + links, source, count=1)
    if 'class="language-switcher"' not in source:
        switcher = (
            f'      <div class="language-switcher" aria-label="Language selection">\n'
            f'        <a href="{filename}" lang="en" hreflang="en" aria-current="page">EN</a>'
            f'<span class="language-switcher-separator" aria-hidden="true">/</span>\n'
            f'        <a href="fr/{filename}" lang="fr" hreflang="fr">FR</a>\n'
            f'      </div>\n\n'
        )
        source = source.replace('      <button\n        class="theme-toggle"', switcher + '      <button\n        class="theme-toggle"', 1)
    if '"inLanguage"' not in source:
        source = source.replace('"isPartOf": {', '"inLanguage": "en",\n    "isPartOf": {', 1)
    path.write_text(source, encoding="utf-8")


def collect_translatable_text(source: str) -> set[str]:
    source = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", "", source, flags=re.I | re.S)
    values: set[str] = set()
    for token in re.split(r"(<[^>]+>)", source):
        if token.startswith("<"):
            for value in re.findall(r'\b(?:aria-label|alt|title)="([^"]+)"', token):
                values.add(" ".join(html.unescape(value).split()))
            continue
        clean = " ".join(html.unescape(token).split())
        if clean and re.search(r"[A-Za-z]", clean):
            values.add(clean)
    for value in re.findall(
        r'<meta (?:name|property)="(?:description|keywords|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)"\s+content="([^"]+)"',
        source,
    ):
        values.add(" ".join(html.unescape(value).split()))
    return values


def main() -> None:
    pending: set[str] = set()
    for filename in PAGES:
        pending.update(collect_translatable_text((ROOT / filename).read_text(encoding="utf-8")))
    pending.difference_update(CACHE)
    with ThreadPoolExecutor(max_workers=16) as executor:
        list(executor.map(translate, sorted(pending)))
    for filename in PAGES:
        (ROOT / "fr" / filename).write_text(localize_page(filename), encoding="utf-8")
        add_english_alternates(filename)
        print(f"Synchronized fr/{filename}")


if __name__ == "__main__":
    main()

import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  throw new Error(
    "Playwright is required. Install it locally or expose the bundled node_modules through NODE_PATH.",
    { cause: error },
  );
}

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const TMP_DIR = path.join(ROOT, "tmp", "pdfs", "cv-candidates");
const OUTPUT_DIR = path.join(ROOT, "output", "pdf");
const FINALIZER = path.join(ROOT, "scripts", "finalize_accessible_cv_pdf.py");

const CONTACT = {
  email: "pacifiquefashaho04@gmail.com",
  website: "https://pacifiquefashaho.me/",
  websiteFr: "https://pacifiquefashaho.me/fr/",
  linkedin: "https://www.linkedin.com/in/pacifique-fashaho-8ab656388",
  github: "https://github.com/PacifiqueFashaho",
};

const CSS = String.raw`
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    color: #1f2937;
    font-family: Arial, "DejaVu Sans", sans-serif;
    font-size: 10pt;
    line-height: 1.23;
  }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    padding: 13mm 15mm 16mm;
    break-after: page;
    background: #ffffff;
  }
  .page:last-child { break-after: auto; }
  .profile-header { text-align: center; margin-bottom: 3mm; }
  h1 {
    margin: 0;
    color: #0b3b5a;
    font-size: 22pt;
    line-height: 1.08;
    letter-spacing: 0.02em;
  }
  .profession {
    margin: 1.5mm 0 0;
    color: #0b3b5a;
    font-size: 12pt;
    font-weight: 700;
  }
  .disciplines {
    margin: 0.8mm 0 2mm;
    color: #075985;
    font-size: 10.5pt;
    font-weight: 700;
  }
  .contact-line { margin: 0.7mm 0; font-size: 10pt; }
  a { color: #075985; text-decoration: underline; text-underline-offset: 1.5px; }
  h2 {
    margin: 3.1mm 0 1.5mm;
    padding-bottom: 0.8mm;
    border-bottom: 0.35mm solid #94b8d0;
    color: #0b3b5a;
    font-size: 12pt;
    line-height: 1.15;
    break-after: avoid;
  }
  h3 {
    margin: 1.7mm 0 0.5mm;
    color: #0b3b5a;
    font-size: 10.7pt;
    line-height: 1.18;
    break-after: avoid;
  }
  p { margin: 0 0 1.4mm; }
  .capability { margin-bottom: 1mm; }
  .meta { margin-bottom: 0.8mm; color: #374151; font-style: italic; }
  .record { break-inside: avoid; }
  ul { margin: 0.6mm 0 1.2mm; padding-left: 5.2mm; }
  li { margin: 0 0 0.55mm; padding-left: 0.4mm; }
  .projects li { margin-bottom: 0.65mm; }
  .scope { color: #374151; }
  .credentials li { margin-bottom: 0.8mm; }
  .compact-record { margin-bottom: 1.5mm; break-inside: avoid; }
  .compact-record h3 { display: block; margin: 1.2mm 0 0.35mm; }
  .compact-record p { display: block; margin: 0; }
  .footer {
    position: absolute;
    left: 15mm;
    right: 15mm;
    bottom: 5mm;
    text-align: center;
    color: #4b5563;
    font-size: 8.5pt;
  }
  @media print {
    a { color: #075985; }
  }
`;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const link = (label, href) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

const list = (items, className = "") =>
  `<ul${className ? ` class="${className}"` : ""}>${items
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>`;

const role = ({ title, organization, date, bullets }) => `
  <article class="record">
    <h3>${escapeHtml(title)}</h3>
    <p class="meta">${escapeHtml(organization)} | ${escapeHtml(date)}</p>
    ${list(bullets.map(escapeHtml))}
  </article>`;

const project = ({ title, href, bullets }) => `
  <article class="record projects">
    <h3>${link(title, href)}</h3>
    ${list(bullets.map(escapeHtml))}
  </article>`;

const credential = ({ title, href, detail }) =>
  `${link(title, href)} - ${escapeHtml(detail)}`;

const DATA = {
  en: {
    lang: "en-US",
    htmlTitle: "Pacifique Fashaho - Professional CV",
    description: "Data analytics, artificial intelligence, IT systems, and automation",
    filename: "Pacifique_Fashaho_CV_candidate.pdf",
    profession: "Computer Science Professional",
    disciplines: "Data Analytics | Artificial Intelligence | IT Systems | Automation",
    location: "Goma, DR Congo",
    websiteLabel: "pacifiquefashaho.me",
    website: CONTACT.website,
    headings: {
      profile: "PROFESSIONAL PROFILE",
      capabilities: "CORE CAPABILITIES",
      experience: "PROFESSIONAL EXPERIENCE",
      continued: "PROFESSIONAL EXPERIENCE - CONTINUED",
      projects: "SELECTED PROJECT EVIDENCE",
      credentials: "VERIFIED PROFESSIONAL CREDENTIALS",
      education: "EDUCATION",
      languages: "LANGUAGES AND WORKING ARRANGEMENTS",
    },
    summary:
      "I work across data analytics, artificial intelligence, IT systems, and automation to solve technical problems, analyze information, improve digital workflows, and support better decision-making. I clean and validate data, prepare reports and dashboards, support Windows workstations and users, and build tested workflows with Python, SQL, JavaScript, web technologies, and reviewed AI-assisted processes.",
    capabilities: [
      ["Data Analytics", "SQL, Excel, Google Sheets, data cleaning and validation, reporting, dashboards, data visualization, data interpretation, KoBoToolbox, and ODK."],
      ["Artificial Intelligence", "Generative AI, large language models, structured prompting, AI-assisted analysis, structured outputs, claim validation, human review, and deterministic fallback."],
      ["IT Systems", "Windows, hardware and software troubleshooting, workstation setup, common networking and connectivity, printers and shared resources, user support, and IT documentation."],
      ["Automation and Programming", "Python, APIs, workflow automation, data processing, reporting automation, JavaScript, HTML/CSS, Git/GitHub, responsive web programming, and UX."],
    ],
    roles: [
      {
        title: "IT Support Technician & Digital Services Assistant",
        organization: "Cybercafé & Printing Center SMITH | Goma, DR Congo",
        date: "December 2025 - Present",
        bullets: [
          "Provide technical support for computers, printers, Internet access, and office applications.",
          "Install, configure, and maintain Windows, drivers, antivirus tools, and productivity software.",
          "Troubleshoot hardware, software, connectivity, printing, and scanning issues, and assist users with digital documents and online services.",
        ],
      },
      {
        title: "Field Data Enumerator & Technical Support",
        organization: "CAAP TUJITEGEMEE, NGO | Goma, DR Congo",
        date: "July 2025 - November 2025",
        bullets: [
          "Collected digital field data using KoBoToolbox and ODK.",
          "Configured mobile devices, supported field teams, and troubleshot field connectivity and device issues.",
          "Cleaned and validated collected data and supported supervisors with reporting and data-quality checks.",
        ],
      },
      {
        title: "IT Support & Data Assistant",
        organization: "HIGH TECH BUSINESS | Goma, DR Congo",
        date: "March 2025 - July 2025",
        bullets: [
          "Installed and configured computers, printers, and business software.",
          "Resolved hardware and software issues and supported daily technical operations.",
          "Cleaned, organized, and analyzed data with Excel and Google Sheets, and prepared reports and dashboards to support decision-making.",
        ],
      },
      {
        title: "IT & Administrative Assistant",
        organization: "Cybercafé KivuNet | Goma, DR Congo",
        date: "June 2024 - April 2025",
        bullets: [
          "Provided daily IT support and customer service for computer users.",
          "Maintained Windows and other software and troubleshot Internet, printing, scanning, and workstation issues.",
          "Assisted users with online services and supported file organization, administrative work, and document preparation.",
        ],
      },
    ],
    projects: [
      {
        title: "AI-Assisted Data Quality & Reporting Workflow",
        href: "https://pacifiquefashaho.me/project-ai-data-quality-workflow.html",
        bullets: [
          "Implemented a reproducible Python and SQL workflow for 900 synthetic operational records, with ordered validation, transactional SQLite loading, and reconciled metrics: 840 accepted records, 60 rejected records, and 66 defect events.",
          "Produced deterministic JSON, ten-sheet Excel, HTML, and five-chart outputs; constrained optional AI drafting with structured-response and claim validation, human review, rejection controls, and deterministic fallback.",
          "Scope: synthetic portfolio project; not a client deployment or autonomous AI decision system.",
        ],
      },
      {
        title: "Data Cleaning & Reporting",
        href: "https://pacifiquefashaho.me/project-data-cleaning-case-study.html",
        bullets: [
          "Documented a controlled process for cleaning, validating, interpreting, and communicating data, with a reproducible sample, explicit decisions, validation checks, and reporting limits.",
        ],
      },
      {
        title: "Workstation Setup & Troubleshooting",
        href: "https://pacifiquefashaho.me/project-it-support-case-study.html",
        bullets: [
          "Published a representative eight-stage support workflow covering intake, diagnosis, safe intervention, verification, documentation, and user handoff for workstation and connectivity issues.",
        ],
      },
      {
        title: "Bilingual Portfolio Platform",
        href: "https://pacifiquefashaho.me/project-portfolio-case-study.html",
        bullets: [
          "Designed and maintain a bilingual responsive website using HTML, CSS, and JavaScript, with accessible interactions, contact-service integration, SEO, performance controls, Git-based delivery, and repeatable release checks.",
        ],
      },
    ],
    credentials: [
      {
        title: "Microsoft IT Support Specialist Professional Certificate",
        href: "https://www.coursera.org/account/accomplishments/professional-cert/INX0MLM37QFT",
        detail: "Microsoft, via Coursera | Completed September 8, 2026",
      },
      {
        title: "Google IT Support Professional Certificate",
        href: "https://www.coursera.org/account/accomplishments/professional-cert/KVWU943XJLY3",
        detail: "Google | Completed April 1, 2026",
      },
      {
        title: "Google Data Analytics Professional Certificate",
        href: "https://www.credly.com/badges/4e1ae728-351c-4ebe-a987-55b83c18c939",
        detail: "Google | Completed February 22, 2026",
      },
      {
        title: "Python for Everybody",
        href: "https://pacifiquefashaho.me/certifications.html",
        detail: "University of Michigan | Completed December 15, 2025",
      },
    ],
    education: [
      ["Bachelor of Science in Computer Science", "University of the People | Online | Expected April 2027", null],
      ["State Diploma in General Pedagogy - 2024", "École d'Application du Cepromad | Goma, DR Congo", null],
    ],
    languages: "French - Very good | English - Very good | Available for remote and on-site opportunities",
    footer: "Pacifique Fashaho | Professional CV",
  },
  fr: {
    lang: "fr-FR",
    htmlTitle: "Pacifique Fashaho - CV professionnel",
    description: "Analyse de données, intelligence artificielle, systèmes informatiques et automatisation",
    filename: "Pacifique_Fashaho_CV_FR_candidate.pdf",
    profession: "Professionnel en informatique",
    disciplines: "Analyse de données | Intelligence artificielle | Systèmes informatiques | Automatisation",
    location: "Goma, RD Congo",
    websiteLabel: "pacifiquefashaho.me/fr/",
    website: CONTACT.websiteFr,
    headings: {
      profile: "PROFIL PROFESSIONNEL",
      capabilities: "CAPACITÉS CLÉS",
      experience: "EXPÉRIENCE PROFESSIONNELLE",
      continued: "EXPÉRIENCE PROFESSIONNELLE - SUITE",
      projects: "PREUVES DE PROJETS SÉLECTIONNÉES",
      credentials: "CERTIFICATIONS PROFESSIONNELLES VÉRIFIÉES",
      education: "FORMATION",
      languages: "LANGUES ET MODALITÉS DE TRAVAIL",
    },
    summary:
      "J'interviens en analyse de données, intelligence artificielle, systèmes informatiques et automatisation pour résoudre des problèmes techniques, analyser l'information, améliorer les workflows numériques et faciliter la prise de décision. Je nettoie et valide les données, prépare des rapports et tableaux de bord, accompagne les utilisateurs et les postes Windows, et développe des workflows testés avec Python, SQL, JavaScript, les technologies web et des processus assistés par l'IA soumis à une revue humaine.",
    capabilities: [
      ["Analyse de données", "SQL, Excel, Google Sheets, nettoyage et validation des données, reporting, tableaux de bord, visualisation, interprétation des données, KoBoToolbox et ODK."],
      ["Intelligence artificielle", "IA générative, grands modèles de langage, prompts structurés, analyse assistée par l'IA, sorties structurées, validation des affirmations, revue humaine et solution de repli déterministe."],
      ["Systèmes informatiques", "Windows, dépannage matériel et logiciel, configuration des postes, réseaux et connectivité courants, imprimantes et ressources partagées, support utilisateur et documentation informatique."],
      ["Automatisation et programmation", "Python, API, automatisation des workflows, traitement des données, automatisation du reporting, JavaScript, HTML/CSS, Git/GitHub, programmation web adaptative et UX."],
    ],
    roles: [
      {
        title: "Technicien Support Informatique et Assistant des Services Numériques",
        organization: "Cybercafé & Printing Center SMITH | Goma, RD Congo",
        date: "Décembre 2025 - Aujourd'hui",
        bullets: [
          "Assurer le support technique des ordinateurs, imprimantes, connexions Internet et applications bureautiques.",
          "Installer, configurer et maintenir Windows, les pilotes, les antivirus et les logiciels de productivité.",
          "Dépanner les problèmes matériels, logiciels, de connectivité, d'impression et de numérisation, et accompagner les utilisateurs pour les documents numériques et les services en ligne.",
        ],
      },
      {
        title: "Enquêteur de terrain et appui technique",
        organization: "CAAP TUJITEGEMEE, ONG | Goma, RD Congo",
        date: "Juillet 2025 - Novembre 2025",
        bullets: [
          "Collecter des données numériques de terrain avec KoBoToolbox et ODK.",
          "Configurer les appareils mobiles, assister les équipes terrain et dépanner les problèmes de connectivité et d'appareils.",
          "Nettoyer et valider les données collectées et appuyer les superviseurs pour le reporting et le contrôle de la qualité des données.",
        ],
      },
      {
        title: "Assistant Support Informatique et Données",
        organization: "HIGH TECH BUSINESS | Goma, RD Congo",
        date: "Mars 2025 - Juillet 2025",
        bullets: [
          "Installer et configurer les ordinateurs, imprimantes et logiciels professionnels.",
          "Résoudre les problèmes matériels et logiciels et appuyer les opérations techniques quotidiennes.",
          "Nettoyer, organiser et analyser les données avec Excel et Google Sheets, puis préparer des rapports et tableaux de bord pour faciliter la prise de décision.",
        ],
      },
      {
        title: "Assistant Informatique et Administratif",
        organization: "Cybercafé KivuNet | Goma, RD Congo",
        date: "Juin 2024 - Avril 2025",
        bullets: [
          "Assurer le support informatique quotidien et le service aux utilisateurs des ordinateurs.",
          "Maintenir Windows et d'autres logiciels et dépanner les problèmes de connexion Internet, d'impression, de numérisation et de postes de travail.",
          "Accompagner les utilisateurs pour les services en ligne et appuyer l'organisation des fichiers, les tâches administratives et la préparation des documents.",
        ],
      },
    ],
    projects: [
      {
        title: "Workflow de qualité des données et de reporting assisté par l'IA",
        href: "https://pacifiquefashaho.me/fr/project-ai-data-quality-workflow.html",
        bullets: [
          "Mise en œuvre d'un workflow reproductible en Python et SQL pour 900 enregistrements opérationnels synthétiques, avec validation ordonnée, chargement transactionnel dans SQLite et indicateurs réconciliés : 840 enregistrements acceptés, 60 rejetés et 66 événements de défaut.",
          "Production de sorties déterministes JSON, Excel sur dix feuilles, HTML et cinq graphiques ; encadrement de la rédaction IA facultative par la validation des réponses structurées et des affirmations, la revue humaine, le rejet des résultats non conformes et une solution de repli déterministe.",
          "Périmètre : projet de portfolio utilisant des données synthétiques ; il ne s'agit ni d'un déploiement client ni d'un système de décision autonome par l'IA.",
        ],
      },
      {
        title: "Nettoyage des données et reporting",
        href: "https://pacifiquefashaho.me/fr/project-data-cleaning-case-study.html",
        bullets: [
          "Documentation d'un processus contrôlé de nettoyage, de validation, d'interprétation et de communication des données, avec un échantillon reproductible, des décisions explicites, des contrôles de validation et des limites de reporting.",
        ],
      },
      {
        title: "Configuration et dépannage d'un poste de travail",
        href: "https://pacifiquefashaho.me/fr/project-it-support-case-study.html",
        bullets: [
          "Publication d'un processus représentatif de support en huit étapes couvrant l'accueil, le diagnostic, l'intervention sûre, la vérification, la documentation et la remise à l'utilisateur pour les problèmes de poste et de connectivité.",
        ],
      },
      {
        title: "Plateforme de portfolio bilingue",
        href: "https://pacifiquefashaho.me/fr/project-portfolio-case-study.html",
        bullets: [
          "Conception et maintenance d'un site bilingue adaptatif en HTML, CSS et JavaScript, avec interactions accessibles, intégration d'un service de contact, SEO, contrôle des performances, livraison avec Git et contrôles de version reproductibles.",
        ],
      },
    ],
    credentials: [
      {
        title: "Microsoft IT Support Specialist Professional Certificate",
        href: "https://www.coursera.org/account/accomplishments/professional-cert/INX0MLM37QFT",
        detail: "Microsoft, via Coursera | Terminé le 8 septembre 2026",
      },
      {
        title: "Google IT Support Professional Certificate",
        href: "https://www.coursera.org/account/accomplishments/professional-cert/KVWU943XJLY3",
        detail: "Google | Terminé le 1er avril 2026",
      },
      {
        title: "Google Data Analytics Professional Certificate",
        href: "https://www.credly.com/badges/4e1ae728-351c-4ebe-a987-55b83c18c939",
        detail: "Google | Terminé le 22 février 2026",
      },
      {
        title: "Python for Everybody",
        href: "https://pacifiquefashaho.me/fr/certifications.html",
        detail: "University of Michigan | Terminé le 15 décembre 2025",
      },
    ],
    education: [
      ["Bachelor of Science in Computer Science - Informatique", "University of the People | En ligne | Diplôme prévu en avril 2027", null],
      ["Diplôme d'État en pédagogie générale - 2024", "École d'Application du Cepromad | Goma, RD Congo", null],
    ],
    languages: "Français - Très bon | Anglais - Très bon | Disponible pour des opportunités à distance et sur site",
    footer: "Pacifique Fashaho | CV professionnel",
  },
};

function header(data) {
  return `<header class="profile-header">
    <h1>PACIFIQUE FASHAHO</h1>
    <p class="profession">${escapeHtml(data.profession)}</p>
    <p class="disciplines">${escapeHtml(data.disciplines)}</p>
    <p class="contact-line">${escapeHtml(data.location)} | ${link(CONTACT.email, `mailto:${CONTACT.email}`)} | ${link(data.websiteLabel, data.website)}</p>
    <p class="contact-line">LinkedIn: ${link("linkedin.com/in/pacifique-fashaho-8ab656388", CONTACT.linkedin)} | GitHub: ${link("github.com/PacifiqueFashaho", CONTACT.github)}</p>
  </header>`;
}

function capabilities(data) {
  return data.capabilities
    .map(
      ([label, text]) =>
        `<p class="capability"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(text)}</p>`,
    )
    .join("");
}

function education(data) {
  return data.education
    .map(([title, detail, href]) => {
      const titleMarkup = href ? link(title, href) : escapeHtml(title);
      return `<article class="compact-record"><h3>${titleMarkup}</h3><br><p>${escapeHtml(detail)}</p></article>`;
    })
    .join("");
}

function render(data) {
  const firstRoles = data.roles.slice(0, 3).map(role).join("");
  const remainingRoles = data.roles.slice(3).map(role).join("");
  const projects = data.projects.map(project).join("");
  const credentials = list(
    data.credentials.map(credential),
    "credentials",
  );
  return `<!doctype html>
<html lang="${escapeHtml(data.lang)}">
<head>
  <meta charset="utf-8">
  <meta name="author" content="Pacifique Fashaho">
  <meta name="description" content="${escapeHtml(data.description)}">
  <meta name="color-scheme" content="light only">
  <title>${escapeHtml(data.htmlTitle)}</title>
  <style>${CSS}</style>
</head>
<body>
  <main>
    <div class="page">
      ${header(data)}
      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading">${escapeHtml(data.headings.profile)}</h2>
        <p>${escapeHtml(data.summary)}</p>
      </section>
      <section aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading">${escapeHtml(data.headings.capabilities)}</h2>
        ${capabilities(data)}
      </section>
      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">${escapeHtml(data.headings.experience)}</h2>
        ${firstRoles}
      </section>
      <p class="footer" aria-hidden="true">${escapeHtml(data.footer)} | Page 1 ${data.lang === "fr-FR" ? "sur" : "of"} 2</p>
    </div>
    <div class="page">
      <section aria-labelledby="experience-continued-heading">
        <h2 id="experience-continued-heading">${escapeHtml(data.headings.continued)}</h2>
        ${remainingRoles}
      </section>
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">${escapeHtml(data.headings.projects)}</h2>
        ${projects}
      </section>
      <section aria-labelledby="credentials-heading">
        <h2 id="credentials-heading">${escapeHtml(data.headings.credentials)}</h2>
        ${credentials}
      </section>
      <section aria-labelledby="education-heading">
        <h2 id="education-heading">${escapeHtml(data.headings.education)}</h2>
        ${education(data)}
      </section>
      <section aria-labelledby="languages-heading">
        <h2 id="languages-heading">${escapeHtml(data.headings.languages)}</h2>
        <p>${escapeHtml(data.languages)}</p>
      </section>
      <p class="footer" aria-hidden="true">${escapeHtml(data.footer)} | Page 2 ${data.lang === "fr-FR" ? "sur" : "of"} 2</p>
    </div>
  </main>
</body>
</html>`;
}

function findChrome() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      "No supported Chromium executable found. Set PLAYWRIGHT_CHROMIUM_EXECUTABLE.",
    );
  }
  return found;
}

function finalize(rawPath, outputPath, language) {
  const python = process.env.CV_PYTHON || "python";
  const result = spawnSync(
    python,
    [FINALIZER, rawPath, outputPath, language],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Metadata finalizer failed with exit code ${result.status}`);
  }
}

async function printCandidate(browser, language, data) {
  const htmlPath = path.join(TMP_DIR, `cv-${language}.html`);
  const rawPath = path.join(TMP_DIR, `cv-${language}-raw.pdf`);
  const outputPath = path.join(OUTPUT_DIR, data.filename);
  await writeFile(htmlPath, render(data), "utf8");

  const page = await browser.newPage();
  try {
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    const session = await page.context().newCDPSession(page);
    const result = await session.send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      generateTaggedPDF: true,
      generateDocumentOutline: true,
      transferMode: "ReturnAsBase64",
    });
    await writeFile(rawPath, Buffer.from(result.data, "base64"));
    finalize(rawPath, outputPath, language);
    return outputPath;
  } finally {
    await page.close();
  }
}

async function main() {
  const publicTargets = new Set([
    path.join(ROOT, "Pacifique_Fashaho_CV.pdf").toLowerCase(),
    path.join(ROOT, "Pacifique_Fashaho_CV_FR.pdf").toLowerCase(),
  ]);
  for (const data of Object.values(DATA)) {
    const candidate = path.join(OUTPUT_DIR, data.filename).toLowerCase();
    if (publicTargets.has(candidate)) {
      throw new Error("Candidate generation must never overwrite a public CV path");
    }
  }

  await mkdir(TMP_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    executablePath: findChrome(),
    headless: true,
  });
  try {
    const outputs = [];
    outputs.push(await printCandidate(browser, "en", DATA.en));
    outputs.push(await printCandidate(browser, "fr", DATA.fr));
    for (const output of outputs) console.log(output);
  } finally {
    await browser.close();
    await rm(TMP_DIR, { recursive: true, force: true });
  }
}

await main();

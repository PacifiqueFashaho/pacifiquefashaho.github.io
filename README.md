# Pacifique Fashaho — Bilingual Technology Portfolio

[![Live site](https://img.shields.io/badge/Live-GitHub%20Pages-0969da?logo=github)](https://pacifiquefashaho.me/)
[![Quality checks](https://github.com/PacifiqueFashaho/pacifiquefashaho.github.io/actions/workflows/quality.yml/badge.svg)](https://github.com/PacifiqueFashaho/pacifiquefashaho.github.io/actions/workflows/quality.yml)
![Static HTML](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JavaScript-0b1f3a)
![Languages](https://img.shields.io/badge/Languages-English%20%7C%20Fran%C3%A7ais-14b8a6)

A maintained, bilingual portfolio for **Pacifique Fashaho**, an IT Support Technician based in Goma, DR Congo. It presents verified learning, practical support workflows, case studies, and knowledge guides. Software development and data analytics appear as complementary capabilities.

**Live website:** [pacifiquefashaho.me](https://pacifiquefashaho.me/)

**Version française:** [pacifiquefashaho.me/fr/](https://pacifiquefashaho.me/fr/)

## Purpose

The site helps recruiters, academic reviewers, and collaborators move from a concise introduction to verifiable evidence:

1. understand the professional profile;
2. inspect practical projects and case studies;
3. review credentials and their verification links;
4. explore safe IT support knowledge resources;
5. use a clear contact path.

This is a static presentation website. It has no user accounts, database, private dashboard, or server-side application backend.

## Verified credentials

[![Google IT Support Professional Certificate](https://img.shields.io/badge/Google_IT_Support-Professional_Certificate-4285F4?logo=google&logoColor=white)](https://www.coursera.org/account/accomplishments/professional-cert/KVWU943XJLY3)
[![Google IT Support Credly badge](https://img.shields.io/badge/Credly-Verify_IT_Support_Badge-ff6b00)](https://www.credly.com/badges/4ad62e8d-c1d6-4f8a-9c83-fad8f38844c1)
[![Google Data Analytics](https://img.shields.io/badge/Google_Data_Analytics-Verified_Badge-34A853?logo=google&logoColor=white)](https://www.credly.com/badges/4e1ae728-351c-4ebe-a987-55b83c18c939)

The complete, evidence-linked learning record is available on the [Certifications page](https://pacifiquefashaho.me/certifications.html). Credential scope is presented proportionally; a certificate is not treated as a substitute for professional experience.

## Main experiences

| Area | English | Français |
| --- | --- | --- |
| About | [Homepage](https://pacifiquefashaho.me/) | [Accueil](https://pacifiquefashaho.me/fr/) |
| Professional portfolio | [Portfolio](https://pacifiquefashaho.me/portfolio.html) | [Portfolio](https://pacifiquefashaho.me/fr/portfolio.html) |
| Project catalogue | [Projects](https://pacifiquefashaho.me/projects.html) | [Projets](https://pacifiquefashaho.me/fr/projects.html) |
| Credentials | [Certifications](https://pacifiquefashaho.me/certifications.html) | [Certifications](https://pacifiquefashaho.me/fr/certifications.html) |
| IT support knowledge | [Knowledge hub](https://pacifiquefashaho.me/it-support-knowledge.html) | [Centre de ressources](https://pacifiquefashaho.me/fr/it-support-knowledge.html) |
| Privacy | [Privacy & analytics](https://pacifiquefashaho.me/privacy.html) | [Confidentialité](https://pacifiquefashaho.me/fr/privacy.html) |

Selected case studies:

- [Windows workstation troubleshooting](https://pacifiquefashaho.me/project-it-support-case-study.html)
- [Network and shared-printer troubleshooting](https://pacifiquefashaho.me/project-network-printer-case-study.html)
- [Data cleaning and reporting](https://pacifiquefashaho.me/project-data-cleaning-case-study.html)
- [Sales performance dashboard](https://pacifiquefashaho.me/project-sales-dashboard.html)
- [Bilingual portfolio platform](https://pacifiquefashaho.me/project-portfolio-case-study.html)

## Product highlights

- Separate, reciprocal English and French routes with canonical and `hreflang` relationships.
- Responsive layouts for desktop, tablet, and small mobile screens.
- Semantic landmarks, skip links, visible focus, keyboard operation, reduced-motion support, and useful alternative text.
- An interactive IT Support Workbench with scenario-specific steps and copyable diagnostic command references.
- An accessible contact assistant that creates editable drafts before redirecting to email, WhatsApp, or the contact section.
- Consent-based, privacy-restricted analytics that remains disabled by default.
- Open Graph, Twitter Card, JSON-LD, sitemap, and social-preview safeguards.
- Automated validation for routes, links, assets, bilingual parity, accessibility markers, structured data, and performance budgets.

## Architecture

```text
.
├── .github/
│   └── workflows/
│       └── quality.yml              # GitHub Actions quality gate
├── assets/
│   ├── certificates/                # Public credential evidence
│   ├── css/                         # Shared and page-specific styles
│   ├── data/                        # Reserved static JSON datasets
│   ├── images/
│   │   ├── logos/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── social/                  # Deterministic 1200×630 previews
│   │   ├── ui/
│   │   └── workstations/
│   └── js/                          # Navigation, analytics, assistant, Workbench
├── docs/                             # Content, UX, and evidence decisions
├── fr/                               # French counterparts for public routes
├── scripts/
│   ├── generate_recruiter_cvs.py
│   ├── generate_social_cards.py
│   ├── test_assistant_intents.js
│   └── validate_site.py
├── index.html                        # About / homepage
├── portfolio.html                    # Professional evidence and contact
├── projects.html                     # Project catalogue
├── certifications.html               # Verified learning evidence
├── it-support-knowledge.html          # Practical knowledge hub
├── sitemap.xml
└── robots.txt
```

The public experience uses HTML, CSS, and vanilla JavaScript. It does not require a bundler, package manager, JavaScript framework, or build step.

## Design and engineering principles

- **Evidence before claims:** distinguish professional experience, self-directed work, representative workflows, and learning projects.
- **IT support first:** keep the primary role clear while showing software and data range responsibly.
- **Progressive enhancement:** core content and navigation remain useful before JavaScript runs.
- **Bilingual parity:** maintain equivalent routes and structure while allowing natural localization.
- **Accessible interaction:** preserve semantic HTML, keyboard access, focus management, touch targets, and reduced motion.
- **Low-bandwidth delivery:** use a static architecture, optimized assets, lazy loading, and enforced file-size budgets.
- **Privacy by default:** do not load optional analytics before consent and do not send form contents or messages to analytics.
- **Maintainable releases:** protect canonical routes, metadata, structured data, internal references, and repository-sensitive files with automated checks.

## Run locally

Prerequisites:

- Git
- Python 3
- Node.js for JavaScript syntax and behavior tests

```bash
git clone https://github.com/PacifiqueFashaho/pacifiquefashaho.github.io.git
cd pacifiquefashaho.github.io
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

No `npm install` or `pnpm install` command is required for the website itself.

## Quality checks

Run the same core checks before proposing a change:

```bash
node --check assets/js/main.js
node --check assets/js/assistant-intents.js
node --check assets/js/contact-assistant.js
node --check assets/js/workbench.js
node scripts/test_assistant_intents.js
python scripts/validate_site.py
git diff --check
```

The validator starts its own temporary local server and checks the public routes, internal links, images, JSON-LD, sitemap, bilingual relationships, accessibility markers, social previews, protected resources, and front-end performance budgets.

GitHub Actions runs the repository quality gate for pull requests and pushes to `main` through [`.github/workflows/quality.yml`](.github/workflows/quality.yml).

### Production performance monitoring

The `Performance monitoring` workflow audits representative English and French production routes every Monday and can also be started manually. Lighthouse CI checks performance, accessibility, best practices, SEO, loading stability, and main-thread blocking. Reports are retained as GitHub Actions artifacts for 30 days; the monitoring adds no browser cookies or tracking scripts to the public site.

## Optional asset generation

The deployed website does not need Python packages, but two maintenance scripts have optional dependencies:

```bash
python -m pip install Pillow reportlab
python scripts/generate_social_cards.py
python scripts/generate_recruiter_cvs.py
```

Social cards are generated deterministically at `1200×630`. Review binary diffs before committing regenerated assets.

## Contribution safeguards

Read [`AGENTS.md`](AGENTS.md) before modifying the repository. In particular:

- keep the site static and GitHub Pages-compatible;
- preserve English/French parity;
- use only verified personal, education, project, and credential facts;
- do not expose private records, tokens, signatures, or unnecessary identifiers;
- never modify the protected Google verification file;
- run the required validation and report browser checks actually performed.

## Deployment

The production site is served by GitHub Pages from the repository. The expected workflow is:

1. create a focused branch;
2. make one scoped change;
3. run the local quality checks;
4. open a pull request and let GitHub Actions validate it;
5. merge only after review.

## License and content use

No open-source license is currently declared. The source is publicly visible, but personal content, certificates, photographs, and identity-related assets should not be reused without permission.

## Contact

- Website: [pacifiquefashaho.me](https://pacifiquefashaho.me/)
- GitHub: [PacifiqueFashaho](https://github.com/PacifiqueFashaho)
- LinkedIn: [Pacifique Fashaho](https://www.linkedin.com/in/pacifique-fashaho-8ab656388)
- Email: [pacifiquefashaho04@gmail.com](mailto:pacifiquefashaho04@gmail.com)

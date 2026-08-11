# Bilingual Portfolio Platform — Evidence Review

**Reviewed:** 2026-08-11
**Repository snapshot:** production merge `0e1d369`
**Status:** approved evidence register for drafting; not a published case study

## Evidence boundary

This is a self-directed, implemented software project maintained by Pacifique Fashaho. It is live on GitHub Pages, but it was not commissioned by a client. The case study may discuss design and engineering decisions demonstrated by the repository. It must not imply client delivery, a commercial contract, a team role, enterprise scale, or measured business impact.

## Verified implementation evidence

| Area | Repository evidence | Approved claim |
| --- | --- | --- |
| Product status | Production site and GitHub Pages release history | Live, maintained static web product |
| Languages | English root pages and corresponding `/fr/` routes with reciprocal language links | Bilingual English/French portfolio |
| Front end | HTML files plus shared CSS and modular JavaScript assets | Built with HTML, CSS, and JavaScript |
| Current scope | 159 tracked files, 35 tracked HTML files, 7 CSS files, 6 JavaScript files at the reviewed snapshot | Snapshot counts may appear only with the review date and must be refreshed before publication |
| Validated scope | `scripts/validate_site.py` currently reports 32 portfolio pages | Automated validation covers 32 portfolio pages at this snapshot |
| Continuous integration | `.github/workflows/quality.yml` | Pull requests and `main` pushes run syntax, assistant, and site validation checks |
| Deployment | GitHub repository and Pages deployment history | Version-controlled release flow through branches, pull requests, CI, merges, and GitHub Pages |
| Accessibility | Skip links, semantic landmarks, reduced-motion rules, visible focus treatment, live regions, labels, and validator checks | Accessibility safeguards are implemented; do not claim formal WCAG certification |
| Localization | Page-pair registry, hreflang checks, locale-safe navigation validation, and bilingual component checks | Language parity is tested automatically for registered pairs |
| SEO | Canonicals, hreflang, metadata, social cards, XML sitemap, structured data, and validation | Technical search metadata is implemented and validated; do not claim ranking results |
| Performance | File-size budgets and responsive asset choices | Front-end assets are subject to repository performance budgets; do not publish a Lighthouse score without a dated run |
| Privacy | Consent-first analytics module, GPC/DNT handling, restricted parameters, and bilingual privacy controls | Analytics remains off until opt-in and custom events exclude form values and personal message content |
| Form resilience | Accessible validation, status regions, direct-contact alternatives, and recovery behavior | Contact paths include validation and fallback options; do not claim delivery rates |

## Evidence artifacts approved for the designed page

1. Current English desktop screenshot.
2. Current French mobile screenshot.
3. Code-native architecture diagram showing pages, shared assets, validation, CI, and deployment.
4. A quality-gate panel derived from the validator and workflow configuration.
5. A consent-flow diagram showing default denial, explicit opt-in, restricted events, and withdrawal.
6. Links to the live product, repository, project catalog, privacy explanation, and contact section.

Screenshots must use public content only. Do not expose analytics account details, tokens, local paths, email inboxes, private records, form submissions, or browser account information.

## Claims requiring release-time revalidation

- tracked file counts;
- tracked HTML, CSS, and JavaScript counts;
- validated page count;
- current production commit;
- performance-budget values;
- live URLs and sitemap membership;
- the latest successful CI and Pages deployment.

## Claims deliberately excluded

- client or employer ownership of the portfolio project;
- team leadership or collaboration not evidenced in the repository;
- traffic, conversion, recruiter, or search improvements without aligned analytics data;
- user-research findings without documented participants and methods;
- Lighthouse, Core Web Vitals, or accessibility scores without dated evidence;
- enterprise, application-security, or scalability claims beyond a static public portfolio;
- completion of the Computer Science degree;
- use of frameworks, databases, cloud services, or APIs not demonstrated by the implementation;
- “fully accessible,” “bug-free,” “perfect SEO,” or similar absolute language.

## Editorial decision

The English and French drafts are approved for UX implementation if the published page:

- labels the work as an implemented self-directed project;
- distinguishes implemented safeguards from measured outcomes;
- dates repository snapshot counts;
- presents limitations and future work;
- keeps the two locales structurally equivalent;
- passes the existing validator before sitemap integration.

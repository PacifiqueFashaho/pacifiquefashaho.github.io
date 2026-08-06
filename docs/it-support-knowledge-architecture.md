# IT support knowledge architecture

This document defines the information architecture for practical IT support knowledge content. It preserves the portfolio's primary IT Support Technician positioning while keeping guides, case studies, projects, and printable resources distinct.

## Architecture decision

The first release will not create a standalone knowledge-hub page. A hub containing only one original guide would be thin, add another crawl target, and compete with the existing projects and printable-resources collections.

Instead, the homepage will provide a compact `#knowledge` discovery section that connects the first guide to the strongest existing evidence. A standalone bilingual hub becomes appropriate only when at least three original bilingual guides are published.

The primary navigation remains unchanged for the first release. This avoids crowding an existing navigation that already contains Skills, Experience, Projects, Certifications, Services, and Contact. Knowledge entry points will be contextual until the library is substantial enough to justify a global item.

## Content types and responsibilities

| Content type | User need | Editorial responsibility | Must not duplicate |
| --- | --- | --- | --- |
| Knowledge guide | Understand a problem and take safe next steps | Plain-language education, reversible checks, stop conditions, preparation for support | Technician repair workflow or project evidence |
| Case study | Evaluate professional method and judgment | Diagnostic reasoning, tools, validation, documentation, evidence boundaries | End-user self-help article |
| Printable resource | Use a concise operational aid | Checklists, intake records, handover fields, escalation notes | Long-form explanation |
| Project page | Review practical work | Context, process, deliverables, verified evidence | Generic advice article |
| Homepage knowledge section | Discover the right content type | Short orientation and descriptive links | Full guide content |

## First guide

**English route:** `/windows-checks-before-it-support.html`

**French route:** `/fr/windows-checks-before-it-support.html`

**English intent:** safe Windows checks before contacting IT support

**French intent:** vérifications sûres sur un PC Windows avant de contacter le support informatique

**Audience:** a non-administrator using a Windows workstation at home or in a small organization.

**Task:** understand what can be checked safely, what information to record, when to stop, and what to send to the technician.

**Boundary:** the guide does not provide administrative repairs, registry changes, BIOS changes, driver removal, account-policy changes, malware removal instructions, or guaranteed fixes.

## Guide outline

1. Identify the task that failed and the visible symptom.
2. Check power, connections, device state, and other safe physical conditions.
3. Confirm whether a restart is appropriate and whether work has been saved.
4. Record recent changes and the exact error message without exposing private data.
5. Separate device, application, network, and account symptoms.
6. Stop for security warnings, data-loss risk, unusual hardware signs, or permission boundaries.
7. Prepare a concise support request with impact, timing, reproduction steps, and checks completed.
8. Continue to the technician method, printable incident record, or contact path.

## Taxonomy

The knowledge system uses three user-facing categories:

- **Safe first checks:** reversible actions and symptom identification for end users.
- **Technician methods:** professional diagnostic workflows and case-study evidence.
- **Operational resources:** printable intake, diagnostic, setup, handover, and escalation aids.

Future original guides may add **Setup and handover** or **Network and printing** only when their intent remains distinct from the existing case studies and checklists.

## Discovery paths for release one

### English

- `/` → `/#knowledge` → `/windows-checks-before-it-support.html`
- `/project-it-support-case-study.html` → `/windows-checks-before-it-support.html`
- `/it-support-resources.html` → `/windows-checks-before-it-support.html`
- `/projects.html` → `/#knowledge` or directly to the guide from the IT support roadmap

### French

- `/fr/` → `/fr/#knowledge` → `/fr/windows-checks-before-it-support.html`
- `/fr/project-it-support-case-study.html` → `/fr/windows-checks-before-it-support.html`
- `/fr/it-support-resources.html` → `/fr/windows-checks-before-it-support.html`
- `/fr/projects.html` → `/fr/#knowledge` or directly to the guide from the IT support roadmap

Every guide must be reachable within two internal clicks from its locale homepage. English pages link only to English destinations in the primary content flow; French pages follow the same rule.

## Guide exit paths

The first guide links to three next steps, in this order:

1. Printable incident intake and troubleshooting record.
2. Representative technician troubleshooting method.
3. Contact section for employment, collaboration, or appropriate support discussion.

The guide does not place the contact action before the useful content or imply emergency support availability.

## Breadcrumb model

Visible breadcrumb:

- English: `Home / IT Support Knowledge / Windows Checks Before IT Support`
- French: `Accueil / Ressources de support / Vérifications Windows avant le support`

For release one, the middle breadcrumb links to the locale homepage `#knowledge` section. When a standalone hub is created, that link changes to the hub without changing the guide URLs.

Structured breadcrumbs use the same hierarchy and absolute production URLs. The guide also includes self-canonical and reciprocal English/French `hreflang` links.

## Related-content rules

- Use one descriptive contextual link per relevant source section; do not repeat the same guide link throughout a page.
- Link because the next page advances the task, not merely to increase link counts.
- The guide and technician case study link to each other with different, destination-specific anchor text.
- The printable-resources page links to the guide from the incident-intake area, not from unrelated printer or setup checklists.
- Related-content blocks contain at most three primary destinations on the first release.

## Standalone hub threshold

Create `/it-support-knowledge.html` and `/fr/it-support-knowledge.html` only when all of the following are true:

- at least three original bilingual guide pairs are ready;
- each guide owns a distinct query and user task;
- each guide has a useful next step into portfolio evidence or operational resources;
- the hub can offer category-based discovery rather than a simple duplicate list;
- global navigation still fits at supported desktop and mobile widths.

At that point the hub becomes the middle breadcrumb destination, appears in the footer, and may replace a lower-priority primary-navigation item after responsive QA.

## Accessibility and interaction constraints

- Use semantic headings and a visible breadcrumb navigation landmark.
- Keep instructions available without JavaScript; disclosure widgets may enhance but never hide essential safety guidance by default.
- Mark warnings and stop conditions with text and semantics, not color alone.
- Keep link labels descriptive outside their surrounding paragraph.
- Maintain visible focus, reduced-motion behavior, approximately 44-pixel touch targets, and readable line length.
- Do not add a site search, content filter, or JavaScript taxonomy UI for a one-guide release.

## Success criteria for the architecture

- No same-language page shares the first guide's primary intent.
- The guide is reachable in two clicks or fewer from the locale homepage.
- The guide has at least two relevant incoming contextual links besides global navigation or footer links.
- English and French paths have reciprocal `hreflang`, self-canonicals, and equivalent task coverage.
- A user can distinguish guide, case study, and printable checklist from their titles and introductory copy.
- The architecture can add two more guide pairs without changing the first guide's URL.

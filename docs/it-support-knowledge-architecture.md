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

## Second guide decision

**English route:** `/suspicious-tech-support-pop-up.html`

**French route:** `/fr/suspicious-tech-support-pop-up.html`

**English intent:** what to do when a suspicious tech-support pop-up or unsolicited support contact appears

**French intent:** que faire face à une fenêtre de faux support technique ou à un contact de support non sollicité

**Audience:** a non-administrator who sees an alarming support message, receives an unsolicited technical-support contact, or is unsure whether a request for remote access, credentials, or payment is legitimate.

**Task:** stop unsafe interaction, recognize common warning signs, record only safe facts, use a trusted support or security channel, and clearly report any access, information, or payment already shared.

**Boundary:** the guide does not provide malware removal, account recovery, charge-dispute, evidence-forensics, remote-access removal, or incident-response instructions. Those actions depend on the affected account, device, organization, and authorized responder.

This topic is intentionally narrower than general phishing education. It owns the immediate user decision around fake technical-support contact and sends suspected compromise to an authorized security or support process.

## Third guide decision

**Working English route:** `/windows-storage-full-safe-checks.html`

**Working French route:** `/fr/windows-storage-full-safe-checks.html`

**English intent:** safe checks when Windows storage is full before contacting IT support

**French intent:** vérifications sûres lorsque le stockage Windows est plein avant de contacter le support informatique

**Audience:** a non-administrator who sees a low-storage warning, cannot complete a routine task because space is limited, or needs to prepare a safer support request.

**Task:** confirm the affected drive and visible capacity, review Windows storage categories and cleanup recommendations, protect important files through an approved process, recheck the original task once, and stop when authorization, file consequences, hardware state, or recurring storage loss is unclear.

**Boundary:** the guide does not provide manual system-folder deletion, registry or command-line cleanup, partition changes, recovery-feature changes, Windows reset or reinstall, third-party cleaner recommendations, unauthorized application removal, or movement of organizational data to personal storage.

This guide owns a specific low-storage decision path. It does not become a general performance guide, Windows Update repair guide, backup tutorial, or technician storage-diagnosis workflow.

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

The second guide remains in **Safe first checks**, with a security-focused stop-and-report task. It does not create a new taxonomy category.

The selected third guide introduces **Device storage and maintenance** as a planned category. Activate that category in navigation only after the bilingual guide is published; until then, it remains an editorial classification rather than a public destination.

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

## Discovery paths for release two

The second guide remains part of the homepage knowledge collection rather than creating a standalone hub. Its three incoming paths reflect distinct user contexts: direct discovery, a stop condition during safe Windows checks, and incident documentation after suspicious contact.

### English

- `/` → `/#knowledge` → `/suspicious-tech-support-pop-up.html`
- `/windows-checks-before-it-support.html#stop` → `/suspicious-tech-support-pop-up.html`
- `/it-support-resources.html#incident-record` → `/suspicious-tech-support-pop-up.html`

### French

- `/fr/` → `/fr/#knowledge` → `/fr/suspicious-tech-support-pop-up.html`
- `/fr/windows-checks-before-it-support.html#stop` → `/fr/suspicious-tech-support-pop-up.html`
- `/fr/it-support-resources.html#incident-record` → `/fr/suspicious-tech-support-pop-up.html`

These links use task-specific anchor text and occur once in each relevant source section. Both locale guides are one click from their homepage and remain inside their locale’s primary content flow.

## Discovery paths for release three

The third guide joins the homepage knowledge collection under **Device storage and maintenance**. Its incoming paths connect direct discovery, a visible low-storage condition during general Windows preparation, and the boundary between end-user checks and technician-led performance diagnosis.

### English

- `/` → `/#knowledge` → `/windows-storage-full-safe-checks.html`
- `/windows-checks-before-it-support.html#steps` → `/windows-storage-full-safe-checks.html`
- `/project-it-support-case-study.html` → `/windows-storage-full-safe-checks.html`

### French

- `/fr/` → `/fr/#knowledge` → `/fr/windows-storage-full-safe-checks.html`
- `/fr/windows-checks-before-it-support.html#steps` → `/fr/windows-storage-full-safe-checks.html`
- `/fr/project-it-support-case-study.html` → `/fr/windows-storage-full-safe-checks.html`

Both localized guides are one click from their locale homepage and have two relevant contextual entry paths. The homepage remains the temporary discovery surface until the standalone bilingual hub is separately designed, validated, and released.

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

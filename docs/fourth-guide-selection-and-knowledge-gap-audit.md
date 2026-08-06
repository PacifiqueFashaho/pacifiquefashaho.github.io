# Fourth bilingual guide selection and post-hub knowledge-gap audit

**Audit date:** 2026-08-06

**Decision:** Select a focused bilingual guide about safe, non-administrative checks when Windows shows a Wi-Fi connection but internet access is unavailable. This phase approves the topic, intent, evidence direction, taxonomy placement, routes, and editorial boundary. It does not approve content drafts, HTML pages, sitemap entries, structured data, or a claim of measured search demand.

## Selected guide

- **English working title:** Wi-Fi connected but no internet: safe checks before contacting IT support
- **French working title:** Wi-Fi connecté mais pas d’Internet : vérifications sûres avant de contacter le support
- **English working route:** `/windows-wifi-no-internet-safe-checks.html`
- **French working route:** `/fr/windows-wifi-no-internet-safe-checks.html`
- **English intent:** safe checks when Windows is connected to Wi-Fi but has no internet before contacting IT support
- **French intent:** vérifications sûres lorsque Windows est connecté au Wi-Fi mais sans accès Internet avant de contacter le support informatique
- **Category:** Connectivity and network access / Connectivité et accès réseau
- **Audience:** a non-administrator using a Windows 10 or Windows 11 device at home, in a small organization, or on an authorized shared network.
- **Task:** identify the visible Windows network state, distinguish one website or application from broader internet loss, compare the affected device with another permitted device, complete only reversible and authorized checks, record the result, and know when to stop or escalate.

## Post-hub knowledge-gap finding

The published hub now covers broad Windows preparation, suspicious support contact, and low storage. The portfolio demonstrates technician-led network and shared-printer diagnosis and provides a printable network/printer checklist, but it does not give a non-administrator a focused decision path for the common state in which Windows appears connected to Wi-Fi while internet-dependent work fails.

The selected guide starts with a specific visible state and ends with a concise connectivity support request. It will not diagnose network infrastructure, repair TCP/IP, administer a router, or reproduce the technician case study. That separation makes the topic useful to end users and useful as evidence of Pacifique’s ability to communicate safe first-line support.

Search Console has not supplied query-level demand for a fourth topic. The selection is therefore based on documented coverage, task distinctness, IT support relevance, authoritative evidence readiness, bilingual suitability, and internal-link value. Future Search Console evidence may refine wording but must not be presented as the reason for this decision.

## Candidate comparison

Scores use a five-point scale. A higher overlap or safety-risk score is worse; the total favors value, distinctness, evidence, bilingual clarity, and linking while subtracting overlap and risk.

| Candidate | User value | Distinct task | Evidence | Bilingual fit | Internal links | Overlap risk | Safety risk | Weighted result | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Wi-Fi connected but no internet: safe checks | 5 | 5 | 5 | 5 | 5 | 2 | 2 | **21** | **Select** |
| Printer will not print: safe checks | 5 | 4 | 5 | 5 | 5 | 4 | 2 | 18 | Defer; existing case study and checklist already own much of the task |
| Windows Update will not install | 4 | 4 | 5 | 5 | 4 | 3 | 4 | 15 | Defer; repair paths quickly become administrative or recovery-oriented |
| Windows sign-in problem preparation | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 12 | Defer; identity, recovery, organizational policy, and security context vary materially |
| Bluetooth device will not connect | 3 | 4 | 5 | 5 | 3 | 2 | 2 | 16 | Reserve as a later peripheral topic; lower current portfolio value |
| Slow Windows computer | 5 | 2 | 4 | 5 | 4 | 5 | 4 | 11 | Reject; too broad and likely to duplicate the general guide and technician method |

## Evidence reviewed

Only authoritative Microsoft support material is counted for the selection. The next drafting phase must reopen and review the relevant source pages before turning any claim into guide copy.

1. [Fix Wi-Fi connection issues in Windows](https://support.microsoft.com/en-us/windows/wi-fi-connection-icons-and-what-they-mean-in-windows-35f58c75-bd23-4b8b-dd1a-009fe53f86b3)
   - Windows exposes distinct Wi-Fi and no-internet states.
   - A connected icon does not prove that every application, website, or service is reachable.
   - Microsoft separates visible connection checks from more advanced network actions.
2. [Fix printer connection and printing problems in Windows](https://support.microsoft.com/en-us/windows/hardware/printer/fix-printer-connection-and-printing-problems-in-windows)
   - Printer failures can depend on the PC network state and whether devices share the expected authorized network.
   - This supports a later contextual link without turning the guide into printer troubleshooting.
3. [Troubleshoot problems updating Windows](https://support.microsoft.com/en-us/windows/deployment/updates-lifecycle/troubleshoot-problems-updating-windows)
   - Windows Update problems may involve connectivity, storage, or update-specific errors.
   - This confirms that the selected guide must not claim that restoring general connectivity resolves an update failure.

## Evidence-controlled claims

The future guide may state that:

- Windows can show a Wi-Fi connection while internet access remains unavailable;
- a problem limited to one approved website or application differs from a broader connectivity problem;
- comparing another permitted service or device can help record scope without proving the cause;
- Wi-Fi state, airplane mode, signal, network name, time, and recent changes are useful observations;
- a restart of the affected device is a reversible check after open work is protected;
- restarting shared network equipment is appropriate only when the user owns it or has explicit authorization and understands the impact;
- unresolved, repeated, organization-wide, security-related, or infrastructure-dependent failures should be documented and escalated.

The guide must not promise restored internet access, identify a root cause, claim that the router or internet provider is at fault, or present one website as proof of general connectivity.

## Safety and authority boundary

The guide must tell the user to stop and use an approved support channel when:

- the device or network is organization-managed;
- the expected network name is unclear or an unfamiliar network appears;
- a captive portal, certificate warning, VPN requirement, security prompt, or suspicious support contact appears;
- other users or critical work could be disrupted by restarting shared equipment;
- the next action requires administrator credentials, router access, network credentials the user does not already possess, driver changes, firewall changes, or command-line repair;
- connection loss affects multiple users, an entire location, a managed service, or safety-critical work;
- the device repeatedly disconnects, hardware warnings appear, or the network adapter disappears.

The guide will not instruct users to:

- log in to a router or change SSID, channel, DNS, DHCP, IP, proxy, or firmware settings;
- run network reset, Winsock, TCP/IP, DNS-flush, PowerShell, Command Prompt, registry, service, or driver repair sequences;
- disable a firewall, antivirus, VPN, certificate check, organizational security control, or network access policy;
- forget a managed network, reveal a Wi-Fi password, connect to an unknown hotspot, or bypass a captive portal or acceptable-use requirement;
- restart shared access points, routers, switches, or modems without ownership or explicit authorization.

## Cannibalization controls

| Existing page | Risk | Boundary |
| --- | --- | --- |
| `/windows-checks-before-it-support.html` | Medium because it includes a broad network observation | Keep the general guide at symptom classification; the fourth guide owns the connected-without-internet decision path. |
| `/project-network-printer-case-study.html` | High if the guide includes diagnostic commands or infrastructure reasoning | The case study retains technician tools, layer isolation, corrective actions, validation, and escalation. The guide remains end-user-facing and non-administrative. |
| `/it-support-resources.html#network-printer-checklist` | Medium if the guide reproduces the checklist | Link to the printable operational aid instead of duplicating its full checklist. |
| `/suspicious-tech-support-pop-up.html` | Low to medium when a connection warning requests contact or payment | Use a single stop-condition link; do not add general scam education to the connectivity guide. |
| `/windows-storage-full-safe-checks.html` | Low | Mention storage only when the visible task is a download or update; do not merge storage and connectivity diagnosis. |

## Planned information shape

1. Explain the difference between a visible Wi-Fi connection and confirmed internet access without assuming a cause.
2. Protect open work and record the exact failed task, message, date, and time.
3. Confirm Wi-Fi state, airplane mode, signal, and the expected authorized network name.
4. Compare one approved website or application with another approved destination.
5. Compare the affected device with another permitted device on the same expected network when available.
6. Restart only the affected Windows device after saving work; restart user-owned network equipment only when explicitly safe and authorized.
7. Stop for managed-network boundaries, security prompts, unfamiliar networks, multiple affected users, repeated loss, hardware signs, or administrative actions.
8. Prepare a concise request with scope, network state, affected services, devices compared, recent change, checks completed, and current impact.

## Internal-link plan

Planned contextual sources after implementation:

- the knowledge hub connectivity category → fourth guide;
- the general Windows guide’s network observation → fourth guide;
- the network and shared-printer case study’s end-user boundary → fourth guide;
- the printable network/printer checklist → fourth guide where first-line observation precedes technician diagnostics.

The guide will exit to the printable network/printer checklist, the technician network/printer case study, and the suspicious-contact guide only when the visible connection message requests an unsafe action.

## Architecture effect

Publishing the fourth pair would add **Connectivity and network access** as a fourth guide category. The existing hub can accommodate four cards as a balanced two-by-two desktop grid and one-column mobile layout without adding search or filters. The general Windows guide remains the start-here page; the fourth guide becomes a symptom-specific branch rather than a replacement.

## Phase 44 outcome

**Approved for Phase 45 evidence-controlled bilingual drafting.** The routes are working reservations only. Do not add them to the hub, homepage, sitemap, structured data, site validator, or production discovery paths until later phases approve the bilingual HTML implementation and release registration.

## Phase 45 outcome

**Approved for guide UX and visual implementation.** The English and French drafts preserve the selected connected-without-internet task, eight-step structure, visible-state and scope comparisons, managed-network boundary, safe restart conditions, stop criteria, concise support record, source attribution, and deliberately excluded administrative actions. The routes remain non-public working reservations until a later phase approves bilingual HTML implementation and release registration.

## Phase 46 outcome

**Approved for technical SEO and structured-data implementation.** Matching English and French HTML pages now apply the established guide system: a scoped connectivity hero, stop-first boundary, five-link page navigation, eight numbered checks, responsive observation table, six-part support-request grid, privacy reminder, and contextual next-step panel. A restrained blue-indigo connectivity accent distinguishes the topic without adding imagery or page weight. Desktop, mobile, dark-mode, overflow, internal-link, heading, duplicate-ID, and console checks passed. The routes remain intentionally absent from the knowledge hubs and sitemap until later integration and release phases.

## Phase 47 outcome

**Approved for knowledge-hub integration and contextual linking.** Both guide pages now provide aligned canonical and reciprocal hreflang signals, extended search-preview directives, localized Open Graph and Twitter metadata, an article category, and valid `TechArticle` plus `BreadcrumbList` JSON-LD. The article entities use verified author, publisher, language, topic, image, accessibility, and Microsoft evidence-citation data only; no publication date, review, rating, FAQ, or outcome claim was invented. The routes remain intentionally absent from both knowledge hubs, the sitemap, and the public-page validator until later integration and release phases.

## Phase 48 outcome

**Approved for fourth-guide release review.** The English and French knowledge hubs now expose a fourth connectivity category, matching guide cards, updated four-item `CollectionPage` lists, and search descriptions that accurately cover Wi-Fi connectivity. Contextual entry links were added only from the general Windows network observation, the end-user boundary in the network/printer case study, and the printable network/printer checklist. The fourth guide now exits to that checklist, the technician workflow, and the suspicious-contact guide. Desktop and mobile hub layouts, bilingual navigation targets, internal references, collection order, duplicate IDs, overflow, and console checks passed. Sitemap and public-validator registration remain reserved for the release phase.

## Phase 49 outcome

**Approved for deployment through pull-request review.** The English and French fourth-guide routes are now registered as a bilingual public-page pair and included in the sitemap with the verified release date. The complete release passed static-page, route, internal-resource, accessibility-marker, bilingual-navigation, JSON-LD, JSON, XML, social-preview, performance-budget, browser-layout, JavaScript-syntax, protected-resource, and diff-hygiene validation. Production remains unchanged until the pull request is reviewed and merged.

# Third bilingual guide selection and knowledge-gap audit

**Audit date:** 2026-08-06

**Decision:** Select a focused bilingual guide about safe, non-administrative checks when a Windows device reports low or full storage. This phase approves the topic, intent, evidence direction, and editorial boundary. It does not approve a draft, HTML route, sitemap entry, or claim of search demand.

## Selected guide

- **English working route:** `/windows-storage-full-safe-checks.html`
- **French working route:** `/fr/windows-storage-full-safe-checks.html`
- **English intent:** safe checks when Windows storage is full before contacting IT support
- **French intent:** vérifications sûres lorsque le stockage Windows est plein avant de contacter le support informatique
- **Category:** Device storage and maintenance / Stockage et maintenance de l’appareil
- **Audience:** a non-administrator using Windows 10 or Windows 11 at home or in a small organization.
- **Task:** confirm the visible storage condition, understand what is consuming space, review only Windows-provided cleanup recommendations, protect important files, record the result, and know when to stop or escalate.

## Knowledge-gap finding

The published knowledge library covers broad pre-support preparation and suspicious support contact. The portfolio also demonstrates technician-led workstation, network, printer, setup, and handover methods. It does not yet provide a focused end-user explanation for a common storage warning that can block updates and reduce workstation usability.

The selected task begins with a specific Windows state—low or full storage—and ends with a safer, better documented support request. It does not attempt to diagnose general slowness or repair Windows Update. This creates a new user-facing category while keeping the professional case studies responsible for technician diagnosis.

## Candidate comparison

| Candidate | Distinct user task | Overlap risk | Evidence readiness | Decision |
| --- | --- | --- | --- | --- |
| Windows storage is full: safe checks | Strong: inspect storage, review Windows recommendations, protect files, and escalate | Low to medium | Strong, current Microsoft guidance in English and French | **Select** |
| Printer will not print: safe checks | Useful, but the network/printer case study and printable checklist already own most of the path | High | Strong | Defer until query evidence proves a separate end-user need |
| Wi-Fi or internet is unavailable: safe checks | Broad symptom overlaps the first guide and network case study | High | Strong | Defer |
| Prepare a workstation for user handover | Closely matches the setup case study and handover checklist | High | Moderate | Reject for the third guide |
| Windows Update will not install | Can require administrative troubleshooting, service changes, or recovery actions | Medium to high | Strong | Defer; low storage may be mentioned only as an outcome context |
| Slow Windows computer | Too broad and likely to duplicate the first guide and workstation case study | High | Moderate | Reject |
| Back up a PC before repair | Valuable, but account type, organizational policy, encryption, and backup destination materially change the safe instructions | Medium | Fragmented | Reconsider as a later setup-and-handover guide |

## Evidence reviewed

Only authoritative Microsoft support material is counted for this selection. Search Console has not supplied query-level demand for the topic.

### English

1. [Free up drive space in Windows](https://support.microsoft.com/en-US/Windows/Experience/Storage-FileManagement/free-up-drive-space-in-windows)
   - Windows exposes remaining capacity through File Explorer.
   - Storage Sense and Cleanup recommendations are supported paths for reviewing temporary files, large or unused files, cloud-synced files, and unused applications.
   - Users are expected to review categories before selecting content for removal.
2. [Storage settings in Windows](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/storage-settings-in-windows)
   - Storage settings explain category use, Cleanup recommendations, and storage on other drives.
3. [Free up space for Windows updates](https://support.microsoft.com/en-us/windows/free-up-space-for-windows-updates-429b12ba-f514-be0b-4924-ca6d16fa1d65)
   - Insufficient space can block updates.
   - Microsoft recommends Storage Sense or Cleanup recommendations and advises backing up important files before using external storage for an update.

### French

1. [Libérer de l’espace disque dans Windows](https://support.microsoft.com/fr-FR/Windows/Experience/Storage-FileManagement/free-up-drive-space-in-windows)
   - The French guidance confirms that low storage can affect performance and Windows updates.
   - It documents Assistant Stockage and Recommandations de nettoyage as supported review paths.
2. [Sauvegarder et restaurer avec Sauvegarde Windows](https://support.microsoft.com/fr-fr/windows/sauvegarder-et-restaurer-avec-sauvegarde-windows-87a81f8a-78fa-456e-b521-ac0560e32338)
   - This supports a narrow reminder to protect important files before consequential storage changes; the guide must not assume that every user or organization uses a Microsoft account or OneDrive.

## Evidence-controlled claims

The future guide may state that:

- Windows can show available drive space in File Explorer and storage use in Settings;
- low storage can affect performance and prevent Windows updates;
- Windows provides Storage Sense and Cleanup recommendations;
- cleanup categories must be reviewed before removal;
- important files should be protected using an approved backup or storage process before consequential changes;
- unresolved or rapidly recurring storage loss should be documented and escalated.

The guide must not promise a fixed amount of recovered space, improved speed, a successful update, or a resolved underlying cause.

## Safety and authority boundary

The future guide must tell the user to stop and use an approved support channel when:

- the device is managed and policy does not permit storage changes;
- the user cannot identify whether a file, application, account, or backup location is safe to change;
- important files are not backed up or their synchronization state is unclear;
- Windows proposes system files, a previous Windows installation, or other content whose consequence the user does not understand;
- storage fills again unexpectedly, the reported capacity looks incorrect, the drive produces hardware warnings, or files become unavailable;
- administrator access, encryption changes, repartitioning, reset, reinstall, registry changes, command-line cleanup, or third-party cleaner software would be required.

The guide will not instruct users to manually delete system folders, disable recovery features, alter virtual memory, modify reserved storage, erase another user’s files, uninstall business software without authorization, or move organizational data to personal storage.

## Cannibalization controls

| Existing page | Risk | Boundary |
| --- | --- | --- |
| `/windows-checks-before-it-support.html` | Medium because it includes broad visible-condition checks | Keep one broad storage observation there; the third guide owns the low-storage decision path. |
| `/project-it-support-case-study.html` | Medium because it mentions storage and performance | The case study keeps technician diagnosis and corrective action; the guide remains non-administrative and user-facing. |
| `/project-workstation-user-setup.html` | Low to medium because setup includes storage readiness | Do not turn the guide into provisioning, application installation, or handover acceptance. |
| `/it-support-resources.html` | Medium if the guide reproduces the incident record | Link to the reusable record instead of duplicating all fields. |
| `/suspicious-tech-support-pop-up.html` | Low | Do not add security-contact or malware-removal content unless a suspicious prompt is the reason to stop and use the second guide. |

## Planned information shape

1. Explain what a low-storage warning means without assuming its cause.
2. Save work and confirm the affected drive and visible free space.
3. Review storage categories in Windows Settings.
4. Protect important files and confirm the approved storage or backup boundary.
5. Review Windows Cleanup recommendations one category at a time.
6. Recheck space and repeat the original safe task once.
7. Stop for unclear files, managed-device policy, recurring loss, hardware warnings, or administrative actions.
8. Prepare a concise support record with capacity, affected task, recent change, categories reviewed, action taken, and result.

## Architecture effect

Publishing this pair would create a third original bilingual guide and a second guide-specific category. That would satisfy the guide-count threshold for considering `/it-support-knowledge.html` and `/fr/it-support-knowledge.html`, but it would not automatically approve those hub routes. The third guide must first pass drafting, evidence review, UX, technical SEO, integration, release, and indexing phases.

## Phase 25 outcome

**Approved for Phase 26 evidence-controlled bilingual drafting.** The routes remain working reservations only. Do not add them to the sitemap, homepage, structured data, or site validator until the bilingual HTML implementation is approved in a later phase.

## Phase 26 outcome

**Approved for guide UX and visual implementation.** The English and French drafts preserve the selected task, eight-step structure, Windows-provided review path, file-protection boundary, stop conditions, concise support record, source attribution, and deliberately excluded administrative actions. The routes remain non-public working reservations until a later phase approves bilingual HTML implementation and release registration.

## Phase 28 outcome

**Approved for knowledge-hub integration and contextual linking.** Both localized HTML pages now have indexable robots directives, self-canonicals, reciprocal `hreflang`, localized social metadata, `TechArticle` and `BreadcrumbList` JSON-LD, sitemap entries, query ownership, and automated validation coverage. Production discovery links remain deferred to the next approved phase.

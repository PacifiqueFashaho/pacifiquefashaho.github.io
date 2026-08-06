# Windows pre-support guide evidence review

**Reviewed:** 2026-08-06

**Scope:** Editorial and technical review of the planned English and French guide drafts. This review validates guidance, evidence boundaries, bilingual responsibility, and overlap with existing portfolio content. It does not claim search demand or ranking potential.

## Source hierarchy

1. Microsoft Support for current Windows navigation, connectivity, and scam guidance.
2. Existing portfolio pages for Pacifique Fashaho’s published support methodology and reusable resources.
3. Editorial safety constraints for advice intentionally excluded from an end-user guide.

## Claim review

| Draft guidance | Evidence or rationale | Decision |
| --- | --- | --- |
| Use Start → Power → Restart for a normal restart | Microsoft’s Windows restart documentation gives this route for Windows 10 and 11. | Keep, with save-work and policy conditions. |
| Check visible Ethernet connection and Windows network status | Microsoft recommends confirming the cable connection and reviewing Network & internet status when narrowing Ethernet symptoms. | Keep as observation; do not claim it diagnoses the cause. |
| Compare another permitted service or device | Microsoft uses comparison with another device to help narrow whether the problem is isolated or broader. | Keep with authorization wording. |
| Do not call a number displayed in an alarming pop-up | Microsoft states that genuine Microsoft warnings do not include a telephone number and warns against unsolicited remote support. | Keep as a prominent stop condition. |
| Record the failed task, symptom, timing, changes, and checks | Matches the existing incident-intake structure in `it-support-resources.html`. | Keep; link to the printable record rather than duplicating all fields. |
| Treat a recent update or installation as timing evidence, not proof | Prevents unsupported causal claims and aligns with the case study’s hypothesis-led diagnostic boundary. | Keep. |
| Remove private data from screenshots and never transmit passwords | Privacy-by-minimization rule consistent with the portfolio’s protected-resource requirements. | Keep. |
| Avoid administrator commands and forced repairs | The audience is a non-administrator; these actions can change system state and would duplicate the technician workflow. | Keep as an explicit boundary. |

## Deliberately excluded advice

The drafts do not instruct the user to:

- run Command Prompt, PowerShell, Registry Editor, BIOS/UEFI tools, or administrative troubleshooters;
- reset TCP/IP, release addresses, flush DNS, remove drivers, or uninstall updates;
- disable antivirus, firewall, encryption, account controls, or organizational policy;
- reset Windows, perform malware removal, open the device, or replace components;
- share passwords, recovery keys, private files, or unnecessary identifiers;
- assume that timing proves root cause;
- repeat failed print, message, payment, or transaction actions multiple times.

These exclusions keep the guide within its end-user preparation intent and prevent competition with the technician case study.

## Existing-content overlap review

| Existing page | Overlap risk | Draft response |
| --- | --- | --- |
| `/project-it-support-case-study.html` | High if the guide explains the eight-stage diagnostic method or corrective actions | Draft stops at safe observation and support-request preparation. |
| `/project-workstation-user-setup.html` | Medium if the guide becomes a provisioning or acceptance checklist | Draft does not cover installation, account provisioning, drivers, licensing, or handover. |
| `/it-support-resources.html` | Medium if the guide reproduces printable fields and diagnostic lists | Draft explains why information matters and sends the reader to the reusable record. |
| `/project-network-printer-case-study.html` | Medium if the network section becomes a full diagnostic workflow | Draft limits network content to visible status, connections, and comparison. |

## Bilingual parity review

Both drafts provide the same:

- target audience and non-administrator boundary;
- stop conditions;
- eight-part task sequence;
- safe physical, network, and application observations;
- normal restart conditions;
- recent-change and privacy guidance;
- symptom-classification table;
- support-request structure;
- links planned for resources, technician evidence, and contact.

The French draft uses natural support vocabulary such as *poste*, *demande de support*, *file d’impression*, *fenêtre surgissante*, and *personne autorisée*. It does not translate English syntax mechanically.

## Evidence boundaries

- No client incident, employer outcome, SLA, response time, success rate, or ranking result is claimed.
- The example printing incident is explicitly illustrative and contains no real organization, person, identifier, or performance claim.
- Microsoft references support current product navigation and safety statements; they do not endorse the portfolio or guarantee that the checks resolve a problem.
- The guide states that organizational policy and authorized support processes take precedence.

## Source links

- [Restart (reboot) your PC — Microsoft Support](https://support.microsoft.com/en-us/windows/restart-reboot-your-pc-110262aa-fc79-1c33-7b00-c140ae3a6dac)
- [Fix Ethernet connection problems in Windows — Microsoft Support](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/fix-ethernet-connection-problems-in-windows)
- [Protect yourself from tech support scams — Microsoft Support](https://support.microsoft.com/en-us/office/protect-yourself-from-tech-support-scams)
- Existing local evidence: `project-it-support-case-study.html`, `project-network-printer-case-study.html`, and `it-support-resources.html`.

## Review outcome

**Approved for Phase 4 UX and visual design**, subject to final link labels, page metadata, structured-data fields, and rendered bilingual QA. The drafts remain non-public and must not be added to the sitemap until HTML pages exist and pass validation.

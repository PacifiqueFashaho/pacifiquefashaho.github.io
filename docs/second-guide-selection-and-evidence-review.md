# Second bilingual guide selection and evidence review

**Reviewed:** 2026-08-06

**Decision:** Select a focused guide about suspicious tech-support pop-ups and unsolicited support contact. This phase approves the topic, intent, evidence base, and safety boundary. It does not approve an HTML release or claim search demand.

## Selected guide

**English working title:** What to do when a suspicious tech-support pop-up appears

**French working title:** Que faire face à une fenêtre de faux support technique

**English route:** `/suspicious-tech-support-pop-up.html`

**French route:** `/fr/suspicious-tech-support-pop-up.html`

**Primary user task:** decide what not to do, stop unsafe interaction, record safe facts, and report the event through a trusted channel.

**Audience:** a non-administrator using a personal or organizational computer who sees an alarming pop-up or receives unsolicited technical-support contact.

## Why this topic was selected

The current portfolio already assigns distinct targets to generic Windows preparation, technician troubleshooting, network and printer diagnosis, workstation setup, and printable records. A second guide in any of those areas would risk reproducing existing intent before Search Console provides evidence for expansion.

A suspicious-support guide fills a different decision point: the user is not trying to diagnose a normal fault. The user needs to recognize a potentially deceptive support interaction, avoid increasing exposure, and reach an authorized responder. This strengthens the IT-support knowledge system without turning the portfolio into a cybersecurity claim or incident-response service.

## Candidate review

| Candidate | User value | Overlap risk | Evidence readiness | Decision |
| --- | --- | --- | --- | --- |
| Suspicious tech-support pop-up or unsolicited contact | High: immediate stop-and-report decision | Low when limited to deceptive support contact | Strong bilingual Microsoft guidance plus FTC consumer guidance | **Select** |
| Printer not printing: safe checks | Useful but already represented in the network/printer case study and printable checklist | High | Strong | Defer until query data proves a separate end-user task |
| Internet or Wi-Fi not working: safe checks | Useful but overlaps the network case study and the first guide’s symptom classification | High | Strong | Defer |
| Slow Windows computer before support | Broad and likely to repeat the first guide or technician workflow | High | Moderate | Reject for the current architecture |
| New workstation handover for users | Useful but closely matches the workstation setup case study and handover checklist | High | Strong | Defer |
| General phishing awareness | Valuable but too broad for the portfolio’s current IT-support scope | Medium | Strong | Narrow to fake technical-support contact |

## Evidence hierarchy

1. Microsoft Support for how technical-support scams present, unsafe contact patterns, remote-access risk, and reporting options.
2. U.S. Federal Trade Commission consumer guidance for common scam contact, payment, credential, and remote-access patterns.
3. Existing portfolio privacy, authorization, escalation, and non-administrator boundaries.

CISA was considered but its page blocked automated retrieval during this review. It is not counted as reviewed evidence and no claim depends on it.

## Claim review

| Planned guidance | Evidence or rationale | Decision |
| --- | --- | --- |
| Do not call a telephone number displayed in an alarming error or support pop-up | Microsoft’s English and French guidance explicitly warns against calling a number shown in an error or pop-up; the FTC describes fake warnings that urge users to call. | Keep as the primary stop condition. |
| Treat unsolicited support calls or messages cautiously | Microsoft describes scammers impersonating technology companies by phone; the FTC describes unexpected technical-support contact. | Keep without claiming every unexpected contact is malicious. |
| Do not grant remote access, disclose passwords, or make payment from the prompt | Microsoft and the FTC describe remote-access, credential, personal-information, and payment requests as common scam mechanisms. | Keep as explicit prohibitions. |
| Stop interacting and use a separately verified support or security channel | Prevents the suspicious prompt from choosing the responder. This follows the portfolio’s authorization boundary. | Keep; do not include an unverified telephone number. |
| Report what was already shared or authorized | Microsoft and FTC recovery guidance changes according to whether access, credentials, or payment were provided. | Keep as incident-intake information, not as a recovery tutorial. |
| Record the time, visible message, claimed organization, and actions already taken | Supports safe escalation and the existing incident-record model. | Keep, but never instruct the user to click or reopen content to collect evidence. |
| Review screenshots before sharing | Matches the portfolio’s data-minimization rule. | Keep; exclude passwords, security codes, private messages, financial details, and unrelated personal information. |

## Required stop conditions

The guide must tell the user to stop and use an authorized support or security channel when any contact or prompt:

- requests a password, verification code, recovery key, or unnecessary personal information;
- asks for remote-control software or remote access;
- demands payment, gift cards, cryptocurrency, transfer, or urgent subscription purchase;
- claims the device is infected or locked and supplies a telephone number;
- pressures the user to bypass organizational policy or hide the interaction;
- follows an action that may already have exposed credentials, payment information, or device access.

## Deliberately excluded instructions

The guide will not instruct the user to:

- remove malware, remote-access software, browser extensions, drivers, or system files;
- disable networking, security tools, encryption, or organizational controls as a universal response;
- reset passwords on the possibly affected device;
- dispute charges, contact a bank, or recover an account through a generic sequence;
- preserve forensic evidence, collect logs, trace a caller, or investigate attribution;
- confront the sender, call back, reply, click links, or reopen the prompt;
- guarantee that closing a window means the device is safe.

These tasks require context-specific instructions from an authorized organization, account provider, financial institution, or security responder.

## Existing-content overlap review

| Existing page | Overlap risk | Editorial boundary |
| --- | --- | --- |
| `/windows-checks-before-it-support.html` | Medium because its stop section mentions alarming pop-ups | The first guide keeps one brief stop condition; the second guide owns deceptive-support recognition and safe reporting. |
| `/project-it-support-case-study.html` | Low unless the guide becomes a technical investigation | Do not include diagnostic commands, root-cause analysis, remediation, or validation stages. |
| `/it-support-resources.html` | Medium if the guide reproduces the full incident record | Explain what security-relevant facts to report and link to the reusable record. |
| `/project-network-printer-case-study.html` | None | Do not add unrelated network troubleshooting. |
| `/project-workstation-user-setup.html` | Low | Do not turn the guide into software removal or workstation recovery. |

## Bilingual responsibility

The English and French drafts must cover the same warning signs, stop conditions, reporting facts, privacy limits, and exit paths. French terminology should use natural wording such as *faux support technique*, *fenêtre contextuelle*, *accès à distance*, *code de vérification*, *canal autorisé*, and *informations déjà transmises*.

The French page must not imply that all technical-support contact is fraudulent. Both languages distinguish unsolicited or unverifiable contact from support initiated through a trusted channel.

## Proposed outline

1. Decide whether the contact or prompt is untrusted.
2. Stop: do not call, reply, pay, disclose codes, or grant remote access.
3. Leave the interaction without following its instructions.
4. Record only facts already visible or remembered; do not investigate.
5. Report whether access, information, credentials, or payment were already shared.
6. Contact support or security through a separately verified channel.
7. Follow context-specific recovery instructions from the authorized responder.
8. Continue to the printable incident record or appropriate support contact path.

## Evidence limitations

- The sources describe common scam patterns; they do not prove that every unusual prompt or support contact is fraudulent.
- Microsoft and FTC guidance does not endorse this portfolio or guarantee a particular recovery outcome.
- No client incident, detection rate, response time, security qualification, or recovery result is claimed.
- Search Console has not supplied query-level demand for this topic. Selection is based on architecture fit and evidence readiness, not forecast traffic.

## Reviewed sources

- [Protect yourself from tech support scams — Microsoft Support](https://support.microsoft.com/en-us/office/protect-yourself-from-tech-support-scams-2ebf91bd-f94c-2a8a-e541-f5c800d18435)
- [Se protéger contre les escroqueries au support technique — Support Microsoft](https://support.microsoft.com/fr-fr/office/se-prot%C3%A9ger-contre-les-escroqueries-au-support-technique-2ebf91bd-f94c-2a8a-e541-f5c800d18435)
- [How To Spot, Avoid, and Report Tech Support Scams — U.S. Federal Trade Commission](https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams)
- Existing local boundaries: `windows-checks-before-it-support.html`, `project-it-support-case-study.html`, and `it-support-resources.html`.

## Review outcome

**Phase 15 outcome: approved for guide UX and visual implementation.** The English and French drafts preserve the selected task, warning signs, reporting facts, privacy constraints, exit paths, and deliberately excluded recovery instructions. The guide remains planned content. Do not add its routes to the sitemap or validator until the English and French HTML pages exist and pass release validation.

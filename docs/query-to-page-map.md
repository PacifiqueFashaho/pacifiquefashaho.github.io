# Query-to-page map

This map assigns one primary search intent to each indexable page. It is an editorial guardrail, not a claim that the listed phrases already generate traffic. Search Console data remains the authority for future refinements.

Baseline captured on 2026-08-05: 0 clicks and 6 impressions over three months; 0 clicks and 2 homepage impressions over 28 days; no query-level data.

| Search intent | English target | French target | Supporting intent |
| --- | --- | --- | --- |
| IT support technician in Goma | `/` | `/fr/` | Windows support, user assistance, contact and availability |
| IT support projects and portfolio | `/projects.html` | `/fr/projects.html` | Practical technical work and project evidence |
| Windows workstation troubleshooting method | `/project-it-support-case-study.html` | `/fr/project-it-support-case-study.html` | Safe diagnosis, validation and documentation |
| Network and shared-printer troubleshooting | `/project-network-printer-case-study.html` | `/fr/project-network-printer-case-study.html` | Connectivity checks, Windows tools and escalation |
| New workstation and user setup | `/project-workstation-user-setup.html` | `/fr/project-workstation-user-setup.html` | Updates, devices, handover and user orientation |
| Printable IT support checklists | `/it-support-resources.html` | `/fr/it-support-resources.html` | Incident intake, diagnosis, handover and escalation notes |
| IT support certifications | `/certifications.html` | `/fr/certifications.html` | Google IT Support certificate and verifiable credentials |
| Excel sales dashboard case study | `/project-sales-dashboard.html` | `/fr/project-sales-dashboard.html` | Sales reporting, workbook and dashboard evidence |
| Data cleaning and reporting case study | `/project-data-cleaning-case-study.html` | `/fr/project-data-cleaning-case-study.html` | Data quality, validation and reporting evidence |
| Safe Windows checks before contacting IT support | `/windows-checks-before-it-support.html` | `/fr/windows-checks-before-it-support.html` | End-user symptom identification, reversible checks, stop conditions, and support-request preparation |
| Suspicious tech-support pop-up or unsolicited support contact | `/suspicious-tech-support-pop-up.html` | `/fr/suspicious-tech-support-pop-up.html` | Warning signs, immediate stop conditions, safe reporting, and disclosure of any access, information, or payment already shared |

The Windows pre-support guide must not reproduce the eight-stage technician method, the workstation provisioning workflow, or the printable incident record.

The suspicious-support guide must not become a general phishing guide, malware-removal tutorial, account-recovery workflow, payment-dispute guide, or duplicate of the first guide’s broad Windows preparation steps.

## Decision rules

- Keep the homepage focused on the professional/local intent; detailed troubleshooting queries belong to their case studies.
- Keep `/projects.html` and `/fr/projects.html` as discovery hubs rather than duplicating the full case-study content.
- Treat English and French pages as locale equivalents, not competing pages; preserve reciprocal `hreflang` and self-canonicals.
- Use descriptive internal-link text that identifies the destination topic. Avoid repeated generic labels such as “View case study” when several case studies appear together.
- Do not create a new page for a query until its intent is materially different from every target above and there is enough verified content to satisfy it.
- Review titles or meta descriptions only after a page has at least 100 impressions, or when Search Console shows a persistent query-to-page mismatch.

## Weekly review

Record clicks, impressions, CTR and average position for 7 and 28 days. Then inspect Queries and Pages together:

1. Assign each emerging query to the target above that best satisfies its intent.
2. If Google surfaces the intended page, improve its visible copy and snippet only when the sample is meaningful.
3. If Google surfaces the wrong page, strengthen one contextual link from the ranking page to the intended page before changing metadata.
4. If two same-language pages repeatedly appear for the same query, narrow their headings and supporting copy before considering consolidation.

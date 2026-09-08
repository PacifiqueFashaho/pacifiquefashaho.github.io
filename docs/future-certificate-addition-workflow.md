# Future certificate addition workflow

Date: 2026-09-08

Status: reusable controlled checklist for bilingual portfolio credentials

## Purpose

Use this workflow whenever a new certificate is considered for the public portfolio. It keeps the evidence accurate, private information protected, English and French content aligned, and the professional hierarchy focused on recruiter value rather than certificate volume.

## 1. Audit the source before publishing

- Record the exact credential title, issuer, platform, completion date, verification URL, course or programme scope, and SHA-256 hash.
- Inspect the PDF for phone numbers, addresses, birth information, student identifiers, private email addresses, signatures, grades, transcript records, QR codes, embedded files, scripts, launch actions, forms, and hidden metadata.
- Keep transcripts, identity records, grades, credit recommendations, and unrelated academic evidence private.
- Confirm that the certificate supports only the proposed claims. A completed course does not prove employment, production ownership, seniority, or expert mastery.

## 2. Decide its evidence role

- Assign an evidence ID and compare the credential with current professional roles, projects, and stronger credentials.
- Place it in the main four only when it materially strengthens the target recruiter audience.
- Otherwise place it under additional verified learning or technical interests.
- Preserve the current priority unless stronger evidence justifies a controlled change: Microsoft IT Support Specialist, Google IT Support, Google Data Analytics, then Python for Everybody.

## 3. Prepare the public evidence package

- Prefer the issuer's accessible verification page as the primary proof.
- Publish the original issuer PDF only after privacy and security review; do not alter it in a way that implies issuer approval of the modification.
- If the issuer PDF is not tagged, pair it with an accessible HTML summary containing the exact title, issuer, date, scope, claim boundary, and verification link.
- Use a descriptive, stable filename under `assets/certificates/`.

## 4. Add bilingual content to the structured source

- Add or update the credential once in `assets/data/certifications.json`; do not hand-edit the generated credential sections in either HTML page.
- Add equivalent `en` and `fr` fields with the same evidence strength and facts.
- Use the official credential title. Translate only surrounding explanatory text unless the issuer provides an official translated title.
- Include a concise programme-scope summary, applied-evidence link when available, and a transparent claim boundary.
- Never use juniorizing identity language or make education the first impression.

## 5. Update every controlled surface

- Run `node scripts/generate_certification_pages.mjs` to update `certifications.html` and `fr/certifications.html` from the structured source.
- Run `node scripts/generate_certification_pages.mjs --check` to prove that neither generated page has drifted.
- Update the compact portfolio credential section only if the new credential becomes the featured record.
- Update structured data and page metadata.
- Update the bilingual CV source and its validator only if the credential belongs in the main four.
- Update the evidence register, hierarchy decision, sitemap if a new page is added, and relevant documentation.

## 6. Validate before release

- Confirm exact bilingual order, dates, issuer labels, links, local assets, external-link security, duplicate IDs, heading hierarchy, image dimensions, keyboard focus, contrast, zoom/reflow, and mobile layouts.
- Regenerate temporary CV candidates and run structural, visual, privacy, security, link, font, metadata, language, and bilingual-parity checks.
- Run the complete static-site validator, assistant and contact-flow tests, syntax checks, `git diff --check`, and protected-resource hash check.
- Publish only after the final evidence, privacy, accessibility, and visual review passes.

## Information needed from the owner

For a future certificate, provide the original PDF or official verification URL and say where it should compete in the hierarchy. The audit determines the safest public proof path and whether it belongs in the top four, the complete credential library, or private records only.

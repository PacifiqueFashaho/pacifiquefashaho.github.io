# Portfolio contribution rules

## Product direction

- Position Pacifique Fashaho primarily as an **IT Support Technician**.
- Keep data, programming, and web skills as complementary capabilities.
- Use only verified education, experience, project, and credential facts. Never invent clients, metrics, outcomes, dates, or qualifications.

## Technical constraints

- Keep the site static: HTML, CSS, and vanilla JavaScript only.
- Preserve GitHub Pages compatibility, low-bandwidth performance, and the existing design system.
- Maintain English/French parity through separately approved phases.
- Preserve semantic HTML, keyboard access, visible focus, reduced-motion support, no-JavaScript fallbacks, useful alt text, explicit image dimensions, and approximately 44-pixel touch targets.
- Do not add autoplay, automatic Workbench rotation, fake terminals, permanent loaders, typewriter effects, particles, parallax, card tilting, cursor effects, fake statistics, testimonials, or other distracting effects.

## Privacy and protected resources

- Never edit, move, rename, format, or delete `google32dbf3697617861a.html`.
- Do not expose private student records, identity documents, signatures, addresses, tokens, credentials, or unnecessary personal identifiers.
- Do not delete PDFs or other evidence files without explicit owner approval.

## Git safety

- Never work directly on `main`, force-push, rewrite history, delete branches/tags, merge, push, or open a pull request without explicit authorization.
- Before editing, confirm the branch is not `main`, HEAD descends from `v2.0.0`, the working tree is understood, and the protected Google file is unchanged.
- Work one approved phase at a time; avoid unrelated changes and stop after validation.

## Minimum validation

Run:

```bash
git status --short
git diff --check
git diff --stat
git diff --name-status
node --check assets/js/main.js
```

Also parse JSON and `sitemap.xml`; check duplicate IDs, internal links, assets, external-link security, headings, image attributes, Workbench and no-JavaScript requirements; smoke-test all seven public pages through a local static server; and report any browser tests not actually performed.

# Personal About Page - Content Architecture and Privacy Audit

Status: approved architecture input; no About page has been published yet.

## 1. Purpose

Create a bilingual personal profile that helps a visitor understand who Pacifique Fashaho is beyond a CV. The page should feel human, confident, visually polished, and consistent with the three-pillar professional identity without duplicating the homepage, resume, or recruiter contact journey.

Proposed routes:

- English identity-first homepage: `/`
- French identity-first homepage: `/fr/`
- English full professional portfolio: `/portfolio.html`
- French full professional portfolio: `/fr/portfolio.html`
- Legacy `/about.html` and `/fr/about.html` routes remain as non-indexed
  compatibility redirects to their matching homepages.

Primary visitor questions:

1. Who is Pacifique?
2. What shaped his interest in technology?
3. What does he value when learning, working, and helping others?
4. Where can I see credible evidence of his work?
5. How can I contact him?

## 2. Evidence Inventory

### Safe, currently verified facts

- Name: Pacifique Fashaho.
- Public location level: Goma, DR Congo.
- Professional identity: Technology Professional across IT Support, Software Development, and Data Analytics.
- Current education: Bachelor of Science in Computer Science at University of the People, online, in progress, expected April 2027.
- Earlier education: State Diploma in General Pedagogy from École d'Application du Cepromad in Goma.
- Published professional experience and dates already present on the homepage and resumes.
- Published certifications and project evidence already available in the portfolio.
- Public professional links: portfolio, LinkedIn, GitHub, professional email, and the existing contact flow.

### Available visual evidence

- `assets/images/profile/pacifique-profile.webp`
  - Strong, well-lit square portrait.
  - Neutral background and direct facial visibility.
  - Suitable for the About hero, social preview crop, and compact identity card.
  - Do not stretch beyond its natural quality or reuse it repeatedly on the same page.

### Evidence not currently available

- No verified contextual photos of Goma, schools, workplaces, community activity, travel, visits, hobbies, or personal milestones.
- No approved personal quotations, biography narrative, values statement, interests, languages, birthplace, date of birth, family information, or travel history.
- No consent records for identifiable people who might appear in future photos.

These gaps must remain gaps until Pacifique provides the facts or images. Stock images must not be presented as personal memories, locations visited, schools attended, or lived experience.

## 3. Recommended Information Architecture

### A. Personal hero

Goal: establish identity and warmth within one screen.

Content:

- Portrait.
- First-person heading: `I’m Pacifique Fashaho.` / `Je m’appelle Pacifique Fashaho.`
- Short personal positioning sentence, not a job-title list.
- Location at city/country level only.
- Primary action: `Explore what I build` / `Découvrir ce que je réalise`.
- Secondary action: `Start a conversation` / `Échanger avec moi`.

Avoid:

- Age, birth date, street address, identity documents, or immigration status.
- “Graduate” while the degree remains in progress.
- An oversized résumé download as the dominant action.

### B. My story

Goal: explain the connection between curiosity, practical service, technology, and continued learning.

Format:

- Two or three short first-person paragraphs.
- Maximum 180 words per language.
- One pull quote only after Pacifique approves the exact wording.

Required evidence before drafting:

- When the interest in computers began.
- One real formative experience.
- Why the three technology disciplines matter personally.
- What kind of impact Pacifique wants to create.

### C. Places that shaped me

Goal: provide context without publishing precise movements or addresses.

Initial version:

- Goma: city-level context and a personal explanation supplied by Pacifique.
- University of the People: online learning context, not a physical campus claim.
- École d'Application du Cepromad: education milestone, with public institution name only.

Presentation:

- Editorial cards or timeline entries.
- No embedded live map.
- No home, workplace, or school coordinates.
- No real-time or future travel information.

### D. How I think and work

Goal: communicate personality through observable behaviors.

Recommended themes, pending first-person confirmation:

- Learn continuously.
- Understand the problem before choosing a tool.
- Explain technical work clearly.
- Validate results and document decisions.
- Build with respect for users and privacy.

Each value should include one short example linked to published work. Avoid unsupported personality labels such as “visionary,” “expert,” or “natural leader.”

### E. Beyond the screen

Goal: humanize the page without forcing private disclosure.

Optional topics only if Pacifique chooses to publish them:

- Reading or independent learning.
- Community involvement.
- Sports, music, creative interests, or local exploration.
- Languages used in daily or professional contexts.

This section should be omitted rather than filled with generic content.

### F. Personal gallery

Goal: show real context, not decoration.

Launch rule:

- Do not launch a gallery with only one portrait.
- Use the portrait in the hero and keep a gallery placeholder out of the public page.
- Add the gallery only when at least four approved, distinct contextual images exist.

Future image categories:

1. Learning environment.
2. Technology or project-making context.
3. Goma or community context.
4. Personal interest or meaningful visit.

Every image requires:

- A factual caption in English and French.
- Approximate year only when relevant.
- Alt text describing visible content, not repeating the caption.
- Confirmation that every identifiable person consented to publication.
- Removal of GPS metadata before committing.
- Review for badges, screens, documents, vehicle plates, addresses, and bystanders.

### G. Personal timeline

Goal: connect learning and growth without reproducing the employment timeline.

Use 4-6 milestones maximum. Candidate milestones must be selected and worded by Pacifique. Education and public portfolio milestones may be used; private family or location events should remain optional.

### H. Continue exploring

Goal: return personal trust to credible evidence.

Links:

- Projects.
- Certifications.
- IT Support knowledge guides.
- English/French resume.
- Contact.

## 4. Privacy Classification

### Publish by default

- Name.
- Approved portrait.
- Goma, DR Congo at city/country level.
- Public professional identity.
- Verified education, projects, certifications, and professional history already published.
- Existing professional contact channels.

### Publish only after explicit confirmation

- Personal story and quotations.
- Hobbies, languages, community involvement, beliefs, or values.
- Photos of schools, workplaces, events, travel, or other people.
- Approximate dates for personal milestones.
- Neighborhood-level location or a past place of residence.

### Do not publish

- Street or home address.
- Precise coordinates or live location.
- Date of birth, identity numbers, student number, passport, or financial information.
- Family names or relationship details without a specific reason and consent.
- Daily routine, future travel plans, or predictable schedule.
- Private phone number if it differs from the already approved professional contact channel.
- Unredacted certificates, screens, documents, tickets, or badges containing identifiers.
- Images of children or identifiable third parties without documented consent.

## 5. Bilingual Content Rules

- English and French pages must have the same sections, evidence, images, and privacy boundaries.
- Write naturally in each language; do not publish literal machine translation.
- Use first person throughout: `I`, `my`, `je`, `mon`, `ma`.
- Keep “Bachelor of Science in Computer Science” as the official programme name and explicitly state `in progress / en cours` and `expected April 2027 / fin prévue en avril 2027`.
- Image captions and alt text require bilingual editorial review.
- Language switching must preserve the equivalent About route.

## 6. UX and Accessibility Requirements

- Use semantic landmarks and one H1.
- Keep the hero portrait responsive with a stable aspect ratio and a meaningful alt description.
- Never place essential text inside an image.
- Provide visible keyboard focus and a logical heading hierarchy.
- Respect reduced-motion preferences.
- Avoid an auto-playing carousel; use a static responsive gallery grid when enough images exist.
- Maintain readable line lengths for narrative content.
- Ensure captions remain associated with their images using `figure` and `figcaption`.
- Provide a skip link and preserve the existing navigation and footer system.

## 7. SEO and Structured Data Boundaries

Recommended page intent:

- English title: `About Pacifique Fashaho | Technology, Learning & Life in Goma`
- French title: `À propos de Pacifique Fashaho | Technologie, apprentissage et parcours à Goma`
- Canonical self-links and reciprocal `hreflang` for EN, FR, and x-default.
- Add the pages to `sitemap.xml` only when published.
- Use `ProfilePage` with the existing shared `Person` identity.
- Reuse public `sameAs` links; do not add private social accounts.
- Do not add unsupported `alumniOf`, `knowsLanguage`, awards, birthplace, birth date, or travel claims.
- Social preview should use an approved portrait crop and a minimal text overlay, not a collage of unapproved photos.

## 8. Content Required From Pacifique Before Drafting

The next phase needs short first-person answers to these questions:

1. What first made you interested in computers or technology?
2. What do you enjoy most about solving a technical problem?
3. Why do IT Support, Software Development, and Data Analytics belong together in your story?
4. What do you value when working with other people?
5. What do you enjoy outside technology that you are comfortable publishing?
6. What does Goma mean to you personally?
7. Which four to eight personal photos are you comfortable publishing, and who else appears in them?
8. Is there a short personal message you want visitors to remember?

## 9. Recommended Launch Scope

Version 1 should include:

- Bilingual hero using the existing portrait.
- Approved personal story.
- Three-pillar personal explanation.
- Places that shaped me, using text-first cards.
- How I think and work.
- A compact personal timeline.
- Continue-exploring links.

Version 1 should not include a gallery unless four approved contextual photos are ready. This protects quality, authenticity, privacy, and page performance.

## 10. Acceptance Criteria for the Drafting Phase

- All personal claims come directly from Pacifique or existing verified evidence.
- Every section uses first person.
- English and French meaning is equivalent.
- Degree status is accurate.
- No precise private location or sensitive identifier is present.
- Every proposed photo has ownership, consent, metadata, caption, and alt-text review.
- The About page complements rather than duplicates the homepage and CV.

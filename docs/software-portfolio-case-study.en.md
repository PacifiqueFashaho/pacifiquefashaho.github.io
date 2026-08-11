# Bilingual Portfolio Platform — English Case Study Draft

Status: evidence-controlled editorial draft; not approved for publication until release-time facts are refreshed.

## Metadata

**Proposed URL:** `/project-portfolio-case-study.html`
**Title:** Bilingual Portfolio Platform Case Study | Pacifique Fashaho
**Description:** How I designed, developed, validated, and deployed a bilingual portfolio using accessible front-end patterns, automated quality checks, technical SEO, and consent-first analytics.

## Hero

Eyebrow: Implemented self-directed project · Live and maintained

# Designing and shipping a bilingual portfolio platform

I designed and developed this portfolio as a maintained software product rather than a single presentation page. It connects a personal introduction, professional evidence, projects, certifications, knowledge guides, and contact paths across English and French experiences.

The implementation uses HTML, CSS, and JavaScript with automated repository validation and a version-controlled GitHub Pages release process. This is a self-directed project, not a client commission.

Primary action: Explore the implementation
Secondary action: Visit the live platform
Supporting action: View the repository

## Product snapshot

- Product: bilingual, multi-page static portfolio
- Role: information architecture, UX/UI design, front-end development, localization, accessibility, SEO, quality assurance, and release management
- Languages: English and French
- Delivery: GitHub Pages
- Quality: automated checks on pull requests and production changes
- Snapshot note: repository and page counts must be inserted from the release evidence review

## The problem

My work spans IT Support, Software Development, and Data Analytics. A conventional résumé-style homepage made that range difficult to understand and encouraged visitors to treat every artifact as the same kind of evidence.

The product needed to help different visitors answer different questions:

- Who am I beyond a résumé?
- What technical work can I perform?
- Which examples are professional experience, implemented projects, representative workflows, or learning case studies?
- How can a recruiter verify credentials and reach the right contact path?
- How can English and French visitors receive equivalent information without maintaining two disconnected sites?

## Constraints and evidence rules

The site is public, static, and maintained independently. That created several important constraints:

- protect private records and avoid exposing personal form content;
- keep claims proportional to published evidence;
- maintain reciprocal English/French routes;
- work on mobile and lower-bandwidth connections;
- remain understandable when JavaScript is unavailable;
- use a release process that catches broken links, missing metadata, and bilingual drift.

## Information architecture

I separated the product into focused journeys instead of placing everything on one long homepage:

- About introduces my identity and continuing path.
- Portfolio organizes skills, experience, qualifications, contributions, and contact.
- Projects provides a categorized evidence catalog.
- Case studies explain methods and decision-making in depth.
- Certifications distinguishes primary credentials from supporting learning.
- Knowledge guides provide practical IT Support content.
- Privacy explains analytics choices in plain language.

Shared navigation, language controls, footers, metadata patterns, styles, and scripts keep those journeys connected.

## Front-end architecture

The platform uses static HTML routes with shared CSS, JavaScript, image, data, and document assets. JavaScript progressively enhances navigation, themes, project filtering, contact assistance, About interactions, and privacy-conscious measurement.

The architecture avoids a framework dependency for the published experience. That keeps deployment simple and preserves readable content before enhancement scripts run.

Architecture visual note: show `Bilingual pages → shared assets and data → local validator → GitHub Actions → GitHub Pages`.

## Selected design decisions

### One personal entry point, multiple professional paths

The About experience became the homepage, while detailed recruiter evidence remained in the portfolio and project pages. This reduced the conflict between a personal introduction and a dense professional profile.

### Evidence types are visible

Skills and projects distinguish implemented projects, representative workflows, learning case studies, and verified credentials. The wording prevents a learning artifact from being presented as client work.

### Responsive layouts change composition

Grids intentionally move from three columns to two and then one. Components are allowed to shrink, wrap, or span rows rather than forcing desktop layouts into narrow screens.

### Shared patterns preserve bilingual parity

Registered page pairs, reciprocal language links, shared assets, and automated checks reduce locale drift while allowing natural French phrasing instead of word-for-word translation.

## Accessibility engineering

The implemented safeguards include semantic landmarks, heading hierarchy, skip links, keyboard-operable controls, visible focus treatment, labels and descriptions for forms, live status regions, reduced-motion handling, and non-JavaScript content foundations.

These are implementation safeguards, not a claim of formal accessibility certification. The release process still requires rendered keyboard, screen-size, and bilingual checks.

## Privacy-conscious analytics

Analytics is optional. The Google tag remains unloaded until a visitor explicitly allows measurement. Global Privacy Control and Do Not Track force denial. Advertising storage and personalization remain disabled.

Approved custom measurements use fixed event names and non-personal targets. Names, email addresses, messages, form values, query strings, and custom user identifiers are excluded from portfolio event parameters.

Visitors can review or change their choice from the bilingual privacy pages.

## Quality engineering

The repository includes a Python validator that checks registered pages, internal resources, bilingual relationships, metadata, structured data, sitemap content, protected files, JavaScript architecture, accessibility markers, performance budgets, and local HTTP routes.

GitHub Actions runs JavaScript syntax checks, assistant behavior tests, and static-site validation for pull requests and changes to the production branch. Releases follow a branch, review, CI, merge, deployment, and production-verification sequence.

## Technical SEO and discoverability

The platform implements canonical URLs, reciprocal hreflang links, locale-aware titles and descriptions, social previews, structured data, robots instructions, and an XML sitemap.

These controls improve technical clarity for crawlers. They do not guarantee indexing, ranking, impressions, or clicks, so search outcomes remain separate from implementation claims.

## Result

The result is a live bilingual product that presents my technology profile through connected but distinct evidence journeys. The strongest outcome is the system itself: a public implementation with maintainable assets, automated safeguards, traceable releases, and documented limitations.

Release-time fact panel:

- validated portfolio pages: refresh before publication;
- tracked repository scope: refresh before publication;
- current production commit: refresh before publication;
- most recent successful quality and deployment checks: verify before publication.

## What I learned

- Information architecture is part of software quality, not only content organization.
- Bilingual parity needs automated checks as well as translation review.
- Accessibility regressions often appear at component boundaries and responsive breakpoints.
- Evidence labels make a portfolio more credible than broader claims.
- Deployment verification is necessary because a successful local build does not prove the production artifact is current.
- Privacy decisions should shape instrumentation before analytics data is collected.

## Limitations and next iterations

This is a static, self-directed product. It does not currently demonstrate authenticated application flows, a database-backed service, collaborative development, or client requirements. Analytics receipt and conversion baselines must be treated as unavailable until verified in the provider.

Future work should remain evidence-led: expand software case studies, improve test coverage where behavior becomes more complex, and optimize recruiter paths only after aligned interaction data exists.

## Closing action

Heading: Need someone who can connect UX, front-end implementation, and disciplined delivery?

Supporting text: I am open to roles, internships, and projects where I can contribute to accessible interfaces, maintainable front-end work, automation, or multidisciplinary technology delivery.

Primary action: Discuss a software opportunity
Secondary action: Compare all projects
Supporting links: Live platform · Repository · Privacy and analytics

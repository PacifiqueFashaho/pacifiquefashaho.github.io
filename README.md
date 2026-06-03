# Pacifique Fashaho Portfolio

Static GitHub Pages portfolio for Pacifique Fashaho, an IT Support Technician, Data Analyst, and Junior Developer based in Goma, North Kivu, DR Congo.

The site presents skills, education, certifications, experience, selected projects, services, and contact information for recruiters, clients, NGOs, and small businesses looking for IT support, data analytics, dashboards, field data support, or junior web development help.

## Live Demo

[https://pacifiquefashaho.github.io](https://pacifiquefashaho.github.io)

## Screenshot

Add a screenshot after the next visual review:

```text
assets/images/portfolio-screenshot.png
```

Recommended size: 1200 x 630 px so it can also be reused as a future social sharing image.

## Features

- Responsive, recruiter-focused personal portfolio
- Professional hero section with clear IT support and data analytics value proposition
- Dark/light theme toggle saved in local storage
- Project filters for All, Data Analytics, IT Support, Web, and Field Data
- Project cards structured by problem, tools, what I did, result, and links
- Accessible expandable project details using native `details` and `summary`
- Interactive professional experience timeline
- Mailto contact form that opens an email draft
- Copy-email button with a small success message
- Downloadable CV and certificate PDFs
- SEO metadata, canonical URL, Open Graph tags, Twitter card tags, and JSON-LD structured data
- Accessibility improvements including skip link, focus states, semantic sections, descriptive alt text, and reduced-motion support
- Performance improvements including lazy-loaded non-critical images, image dimensions, and corrected WebP file extensions

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Git and GitHub
- GitHub Pages

No React, Node.js, build tool, or external framework is required.

## Folder Structure

```text
.
|-- index.html
|-- README.md
|-- robots.txt
|-- sitemap.xml
|-- google32dbf3697617861a.html
|-- Pacifique_Fashaho_CV.pdf
|-- assets/
|   |-- certificates/
|   |   |-- Certificate and credential PDF files
|   |-- css/
|   |   |-- style.css
|   |-- images/
|   |   |-- Profile, logo, workstation, and document images
|   |-- js/
|       |-- main.js
```

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/PacifiqueFashaho/pacifiquefashaho.github.io.git
   ```

2. Open the project folder:

   ```bash
   cd pacifiquefashaho.github.io
   ```

3. Open `index.html` directly in a browser.

4. Optional: serve the folder with a simple local server:

   ```bash
   python -m http.server 8000
   ```

5. Visit:

   ```text
   http://localhost:8000
   ```

## Deployment With GitHub Pages

This repository is named `pacifiquefashaho.github.io`, so GitHub Pages can publish it directly from the default branch.

1. Push changes to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` > `Pages`.
4. Select the default branch, usually `main`.
5. Keep the folder as `/root`.
6. Save and wait for GitHub Pages to publish.

The production URL is:

```text
https://pacifiquefashaho.github.io
```

## Main Files

- `index.html`: Page content, SEO metadata, structured data, project cards, contact form, and static sections
- `assets/css/style.css`: Layout, colors, responsive design, theme styles, focus states, timeline, projects, and forms
- `assets/js/main.js`: Theme toggle, project filtering, copy-email action, mailto form, counters, reveal effects, skill bars, scroll progress, and back-to-top behavior
- `robots.txt`: Search crawler rules and sitemap reference
- `sitemap.xml`: Canonical URL for search indexing

## Future Improvements

- Add a dedicated 1200 x 630 social sharing image for Open Graph and Twitter cards
- Publish a full Google Data Analytics capstone repository and link it from the project card
- Publish short case-study pages or repositories for IT support and field data workflows
- Add screenshots for each project card
- Add a downloadable one-page services sheet for clients
- Add bilingual content support for English and French if needed

## Author and Contact

- Author: Pacifique Fashaho
- Location: Goma, North Kivu, DR Congo
- Portfolio: [https://pacifiquefashaho.github.io](https://pacifiquefashaho.github.io)
- GitHub: [https://github.com/PacifiqueFashaho](https://github.com/PacifiqueFashaho)
- LinkedIn: [Pacifique Fashaho](https://www.linkedin.com/in/pacifique-fashaho-8ab656388)
- Email: [pacifiquefashaho04@gmail.com](mailto:pacifiquefashaho04@gmail.com)

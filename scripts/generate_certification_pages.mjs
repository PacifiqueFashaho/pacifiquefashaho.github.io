#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(ROOT, "assets", "data", "certifications.json");
const LANGUAGES = ["en", "fr"];
const checkOnly = process.argv.includes("--check");

const rawData = fs.readFileSync(DATA_PATH, "utf8");
const data = JSON.parse(rawData);
const sourceHash = crypto.createHash("sha256").update(rawData).digest("hex");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function localized(value, language) {
  return typeof value === "string" ? value : value?.[language];
}

function pageHref(href, page) {
  if (href.startsWith("assets/") || href.startsWith("Pacifique_")) {
    return `${page.rootPrefix}${href}`;
  }
  return href;
}

function renderPageActions(actions) {
  return `<div class="btns">${actions.map((action) => `<a class="btn${action.primary ? " primary" : ""}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`).join("")}</div>`;
}

function renderLogo(credential, language, page) {
  const src = pageHref(credential.logo.src, page);
  const alt = localized(credential.logo.alt, language);
  return `<div class="logo-box"><img src="${escapeHtml(src)}" width="500" height="500" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" /></div>`;
}

function renderEvidence(credential, language, common) {
  if (!credential.evidence?.length) return "";
  const links = credential.evidence.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(localized(item.label, language))} <span aria-hidden="true">→</span></a>`).join("");
  return `<div class="credential-applied"><span>${escapeHtml(common.appliedLabel)}</span>${links}</div>`;
}

function renderCredentialActions(credential, language, page, common) {
  if (!credential.actions?.length) return "";
  return `<div class="cert-actions">${credential.actions.map((action) => {
    const href = pageHref(action.href, page);
    return `<a class="cert-btn${action.primary ? " cert-btn-primary" : ""}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(localized(action.label, language))} <span class="visually-hidden">(${escapeHtml(common.newTab)})</span></a>`;
  }).join("")}</div>`;
}

function renderCourses(credential, language, common) {
  if (!credential.courses?.length) return "";
  const items = credential.courses.map((course) => {
    const date = localized(course.date, language);
    const detail = date ? `<div><strong>${escapeHtml(course.name)}</strong><span>${escapeHtml(date)}</span></div>` : `<strong>${escapeHtml(course.name)}</strong>`;
    const verify = course.verify ? `<a href="${escapeHtml(course.verify)}" target="_blank" rel="noreferrer noopener">${escapeHtml(common.courseVerify)} <span class="visually-hidden">(${escapeHtml(common.newTab)})</span></a>` : "";
    return `<li>${detail}${verify}</li>`;
  }).join("");
  return `<details class="credential-course-list"><summary>${escapeHtml(localized(credential.courseSummary, language))}</summary><ol>${items}</ol></details>`;
}

function renderFeatured(credential, language, page) {
  const common = page.common;
  const skills = localized(credential.skills, language).map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  const boundary = credential.boundary ? `<p class="small">${escapeHtml(localized(credential.boundary, language))}</p>` : "";
  return `    <section class="card reveal featured-credential" style="margin-top:16px;" aria-labelledby="${escapeHtml(credential.anchor)}">
      <div class="section-head"><div><p class="small">${escapeHtml(localized(credential.eyebrow, language))}</p><h2 id="${escapeHtml(credential.anchor)}">${escapeHtml(credential.officialTitle)}</h2><span class="small">${escapeHtml(localized(credential.meta, language))}</span></div><span class="credential-priority">${escapeHtml(localized(credential.priority, language))}</span></div>
      <article class="cert featured" data-featured-label="${escapeHtml(common.featuredBadge)}">${renderLogo(credential, language, page)}<div class="meta"><h3>${escapeHtml(common.scopeHeading)}</h3><div class="small">${escapeHtml(localized(credential.summary, language))}</div><ul class="credential-skill-list" aria-label="${escapeHtml(common.skillsAria)}">${skills}</ul>${boundary}${renderEvidence(credential, language, common)}${renderCredentialActions(credential, language, page, common)}</div></article>
      ${renderCourses(credential, language, common)}
    </section>`;
}

function renderCatalogCard(credential, language, page) {
  const common = page.common;
  const skills = localized(credential.skills, language).map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");
  return `<article class="cert">${renderLogo(credential, language, page)}<div class="meta"><h3>${escapeHtml(localized(credential.title, language))}</h3><div class="small">${escapeHtml(localized(credential.meta, language))}</div><ul class="credential-card-skills">${skills}</ul><p class="small">${escapeHtml(localized(credential.summary, language))}</p>${renderEvidence(credential, language, common)}${renderCredentialActions(credential, language, page, common)}</div></article>`;
}

function renderGroup(group, language, page) {
  const cards = data.credentials.filter((credential) => credential.group === group.id).sort((a, b) => a.rank - b.rank).map((credential) => renderCatalogCard(credential, language, page)).join("");
  return `    <section class="card reveal credential-group" style="margin-top:16px;" aria-labelledby="${escapeHtml(group.anchor[language])}">
      <div class="section-head"><div><p class="small">${escapeHtml(group.eyebrow[language])}</p><h2 id="${escapeHtml(group.anchor[language])}">${escapeHtml(group.title[language])}</h2><span class="small">${escapeHtml(group.summary[language])}</span></div></div>
      <div class="cert-grid">${cards}</div>
    </section>`;
}

function renderMain(language) {
  const page = data.pages[language];
  const featured = data.credentials.filter((credential) => credential.featured).sort((a, b) => a.rank - b.rank);
  const groups = [...data.groups].sort((a, b) => a.order - b.order);
  const navigation = [
    ...featured.map((credential) => ({href: `#${credential.anchor}`, label: `${credential.issuer} IT`})),
    ...groups.map((group) => ({href: `#${group.anchor[language]}`, label: group.navigation[language]}))
  ].map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("");
  const evidence = page.hero.evidence.map((item) => `<li><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></li>`).join("");
  const featuredHtml = featured.map((credential) => renderFeatured(credential, language, page)).join("\n");
  const groupHtml = groups.map((group) => renderGroup(group, language, page)).join("\n");
  return `<!-- BEGIN GENERATED CERTIFICATION CONTENT -->
  <!-- certification-source: assets/data/certifications.json sha256=${sourceHash} -->
  <main id="main-content" class="wrap">
    <section class="card reveal certifications-hero" aria-labelledby="cert-page-title">
      <div class="section-head"><div><p class="small">${escapeHtml(page.hero.eyebrow)}</p><h1 class="title" id="cert-page-title">${escapeHtml(page.hero.title)}</h1><p class="summary">${escapeHtml(page.hero.summary)}</p></div><aside class="certifications-hero-panel" aria-label="${escapeHtml(page.hero.panelAria)}"><span class="project-label">${escapeHtml(page.hero.panelLabel)}</span><strong>${escapeHtml(page.hero.panelTitle)}</strong><p>${escapeHtml(page.hero.panelBody)}</p></aside></div>
      ${renderPageActions(page.hero.actions)}
      <ul class="credential-evidence-summary" aria-label="${escapeHtml(page.hero.evidenceAria)}">${evidence}</ul>
      <nav class="cert-category-summary" aria-label="${escapeHtml(page.hero.navigationAria)}">${navigation}</nav>
    </section>
${featuredHtml}
${groupHtml}
    <section class="card reveal certifications-cta" style="margin-top:16px;" aria-labelledby="cert-cta-title"><div class="section-head"><div><h2 id="cert-cta-title">${escapeHtml(page.cta.title)}</h2><p class="summary">${escapeHtml(page.cta.summary)}</p></div>${renderPageActions(page.cta.actions)}</div></section>
  </main>
<!-- END GENERATED CERTIFICATION CONTENT -->`;
}

function renderStructuredData(language) {
  const page = data.pages[language];
  const primary = data.credentials.find((credential) => credential.id === data.priorityOrder[0]);
  const verification = primary.actions.find((action) => action.href.startsWith("https://"));
  const payload = {
    "@context": "https://schema.org", "@type": "CollectionPage", name: page.structuredDataName,
    url: page.structuredDataUrl, image: `https://pacifiquefashaho.me/assets/images/social/certifications${language === "fr" ? "-fr" : ""}.png`,
    description: page.structuredDataDescription, inLanguage: language, dateModified: data.lastUpdated,
    isPartOf: {"@type": "WebSite", name: page.websiteName, url: page.websiteUrl},
    about: {"@type": "Person", name: "Pacifique Fashaho", url: page.websiteUrl},
    mainEntity: {"@type": "EducationalOccupationalCredential", name: primary.officialTitle, credentialCategory: "Professional Certificate", recognizedBy: {"@type": "Organization", name: primary.issuer}, url: verification.href, description: localized(primary.summary, language)}
  };
  return `<!-- BEGIN GENERATED CERTIFICATION STRUCTURED DATA -->
  <script type="application/ld+json">
${JSON.stringify(payload, null, 2).split("\n").map((line) => `  ${line}`).join("\n")}
  </script>
  <!-- END GENERATED CERTIFICATION STRUCTURED DATA -->`;
}

function replaceBlock(source, begin, end, replacement, fallback) {
  const marked = new RegExp(`${begin}[\\s\\S]*?${end}`);
  if (marked.test(source)) return source.replace(marked, replacement);
  if (!fallback.test(source)) throw new Error(`Could not find initial block for ${begin}`);
  return source.replace(fallback, replacement);
}

function validateData() {
  const errors = [];
  if (data.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  for (const language of LANGUAGES) if (!data.pages?.[language]) errors.push(`Missing page locale: ${language}`);
  const ids = data.credentials.map((credential) => credential.id);
  if (new Set(ids).size !== ids.length) errors.push("Credential IDs must be unique");
  const ranks = data.credentials.map((credential) => credential.rank);
  if (new Set(ranks).size !== ranks.length) errors.push("Credential ranks must be unique");
  const rankedTopFour = [...data.credentials].sort((a, b) => a.rank - b.rank).slice(0, 4).map((credential) => credential.id);
  if (JSON.stringify(rankedTopFour) !== JSON.stringify(data.priorityOrder)) errors.push("priorityOrder must match ranks 1-4");
  if (data.credentials.filter((credential) => credential.featured).length !== 2) errors.push("Exactly two credentials must be featured");
  const groupIds = new Set(data.groups.map((group) => group.id));
  for (const credential of data.credentials) {
    if (!credential.featured && !groupIds.has(credential.group)) errors.push(`${credential.id}: invalid group`);
    for (const language of LANGUAGES) {
      for (const field of ["meta", "summary", "skills"]) if (!localized(credential[field], language)) errors.push(`${credential.id}: missing ${field}.${language}`);
      for (const action of credential.actions || []) if (!localized(action.label, language)) errors.push(`${credential.id}: missing action label.${language}`);
    }
    for (const asset of [credential.logo?.src, ...(credential.actions || []).map((action) => action.href)].filter((item) => item?.startsWith("assets/"))) {
      if (!fs.existsSync(path.join(ROOT, asset))) errors.push(`${credential.id}: missing local asset ${asset}`);
    }
    for (const href of [...(credential.actions || []), ...(credential.evidence || [])].map((item) => item.href)) {
      if (/^(javascript|data):/i.test(href)) errors.push(`${credential.id}: unsafe link ${href}`);
    }
  }
  if (/\b(INPP|WhatsApp|diplome\.cd)\b/i.test(rawData)) errors.push("Excluded public evidence appears in certification data");
  if (errors.length) throw new Error(`Certification data validation failed:\n- ${errors.join("\n- ")}`);
}

validateData();
let stale = false;
for (const language of LANGUAGES) {
  const page = data.pages[language];
  const target = path.join(ROOT, page.path);
  const original = fs.readFileSync(target, "utf8");
  let generated = replaceBlock(original, "<!-- BEGIN GENERATED CERTIFICATION STRUCTURED DATA -->", "<!-- END GENERATED CERTIFICATION STRUCTURED DATA -->", renderStructuredData(language), /<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  generated = replaceBlock(generated, "<!-- BEGIN GENERATED CERTIFICATION CONTENT -->", "<!-- END GENERATED CERTIFICATION CONTENT -->", renderMain(language), /<main id="main-content" class="wrap">[\s\S]*?<\/main>/);
  if (generated !== original) {
    if (checkOnly) {
      console.error(`${page.path} is not synchronized with assets/data/certifications.json`);
      stale = true;
    } else {
      fs.writeFileSync(target, generated, "utf8");
      console.log(`Generated ${page.path}`);
    }
  }
}

if (stale) process.exit(1);
if (checkOnly) console.log("Certification pages are synchronized with the structured data source.");

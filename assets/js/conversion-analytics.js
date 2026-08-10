/* Consent-first aggregate analytics. Never sends form values or personal content. */
(function () {
  "use strict";
  const measurementId = "G-2302LX7NW7";
  const consentKey = "portfolio-analytics-consent";
  const isProduction = location.hostname === "pacifiquefashaho.github.io";
  const language = document.documentElement.lang.toLowerCase().startsWith("fr") ? "fr" : "en";
  const privacySignal = navigator.globalPrivacyControl === true
    || navigator.doNotTrack === "1" || window.doNotTrack === "1";
  let analyticsEnabled = false;
  let tagRequested = false;
  window.dataLayer = window.dataLayer || [];

  function gtag() { window.dataLayer.push(arguments); }
  function storedConsent() {
    if (privacySignal) return "denied";
    try {
      const value = localStorage.getItem(consentKey);
      return value === "granted" || value === "denied" ? value : "unset";
    } catch (error) { return "unset"; }
  }
  function saveConsent(value) {
    try { localStorage.setItem(consentKey, value); } catch (error) { /* Remain disabled. */ }
  }
  function updateConsentStatus(value) {
    document.querySelectorAll("[data-analytics-status]").forEach((status) => {
      status.textContent = language === "fr"
        ? `Mesure d’audience : ${value === "granted" ? "activée" : "désactivée"}.`
        : `Anonymous analytics: ${value === "granted" ? "enabled" : "disabled"}.`;
    });
  }
  function enableAnalytics() {
    if (!isProduction || privacySignal || analyticsEnabled) return;
    analyticsEnabled = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("set", "allow_google_signals", false);
    gtag("set", "allow_ad_personalization_signals", false);
    gtag("js", new Date());
    gtag("config", measurementId, { send_page_view: false, ads_data_redaction: true });
    if (!tagRequested) {
      tagRequested = true;
      const googleTag = document.createElement("script");
      googleTag.async = true;
      googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.append(googleTag);
    }
    gtag("event", "page_view", {
      page_location: `${location.origin}${location.pathname}`,
      page_path: location.pathname,
      page_language: language
    });
  }
  function removeAnalyticsCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name === "_ga" || name.startsWith("_ga_")) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    });
  }
  function setConsent(value) {
    if (value !== "granted" && value !== "denied") return;
    const wasEnabled = analyticsEnabled;
    const resolved = privacySignal ? "denied" : value;
    saveConsent(resolved);
    if (resolved === "granted") enableAnalytics();
    else {
      analyticsEnabled = false;
      gtag("consent", "update", { analytics_storage: "denied" });
      removeAnalyticsCookies();
      if (wasEnabled) window.setTimeout(() => location.reload(), 0);
    }
    document.querySelector(".analytics-consent")?.remove();
    updateConsentStatus(resolved);
  }
  function renderConsentPrompt() {
    const prompt = document.createElement("aside");
    prompt.className = "analytics-consent";
    prompt.setAttribute("aria-labelledby", "analytics-consent-title");
    prompt.innerHTML = language === "fr"
      ? '<div><strong id="analytics-consent-title">Mesure d’audience facultative</strong><p>Autorisez des mesures agrégées pour améliorer ce portfolio. Aucun formulaire, message ou identifiant personnalisé n’est envoyé.</p></div><div class="analytics-consent__actions"><button class="btn primary" type="button" data-analytics-consent="granted">Autoriser</button><button class="btn" type="button" data-analytics-consent="denied">Continuer sans mesure</button><a href="privacy.html">Détails</a></div>'
      : '<div><strong id="analytics-consent-title">Optional anonymous analytics</strong><p>Allow aggregate measurements that help improve this portfolio. No form values, messages, or custom identifiers are sent.</p></div><div class="analytics-consent__actions"><button class="btn primary" type="button" data-analytics-consent="granted">Allow</button><button class="btn" type="button" data-analytics-consent="denied">Continue without analytics</button><a href="privacy.html">Details</a></div>';
    document.body.append(prompt);
  }

  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "denied",
    personalization_storage: "denied", security_storage: "granted"
  });
  const consent = storedConsent();
  if (consent === "granted") enableAnalytics();
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
      const choice = event.target.closest("[data-analytics-consent]");
      if (choice) setConsent(choice.dataset.analyticsConsent);
    });
    if (consent === "unset" && isProduction) renderConsentPrompt();
    updateConsentStatus(consent === "granted" ? "granted" : "denied");
  });

  function track(action, target) {
    if (!action || !target) return;
    const event = { event: "portfolio_engagement", action, target, language, page: location.pathname };
    window.dispatchEvent(new CustomEvent("portfolio:conversion", { detail: event }));
    if (analyticsEnabled) {
      gtag("event", action, {
        conversion_target: target,
        page_language: language,
        page_path: location.pathname
      });
    }
    if (typeof window.portfolioAnalyticsSink === "function") {
      window.portfolioAnalyticsSink(Object.freeze({ ...event }));
    }
  }
  function classifyLink(link) {
    const normalized = (link.getAttribute("href") || "").toLowerCase();
    if (/coursera\.org|credly\.com/.test(normalized)) return ["credential_verify", "external_credential"];
    if (/assets\/certificates\/.*\.pdf(?:$|[?#])/.test(normalized)) return ["certificate_view", "certificate_pdf"];
    if (/pacifique_fashaho_cv(?:_fr)?\.pdf(?:$|[?#])/.test(normalized)) return ["resume_view", "resume_pdf"];
    if (/project-[^?#]+\.html/.test(normalized)) return ["portfolio_evidence", "case_study"];
    if (/linkedin\.com/.test(normalized)) return ["professional_profile", "linkedin"];
    if (normalized.startsWith("mailto:")) return ["contact_intent", "email"];
    if (/wa\.me|whatsapp\.com/.test(normalized)) return ["contact_intent", "whatsapp"];
    if (/#contact(?:$|[?])/.test(normalized)) return ["contact_intent", "contact_section"];
    return null;
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    const conversion = link ? classifyLink(link) : null;
    if (conversion) track(...conversion);
  });
  window.portfolioAnalytics = Object.freeze({
    consent: Object.freeze({ set: setConsent, status: storedConsent }),
    track
  });
})();

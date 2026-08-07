/* Privacy-safe recruiter conversion events. No cookies, identifiers, or form values. */
(function () {
  "use strict";

  const measurementId = "G-2302LX7NW7";
  const isProduction = window.location.hostname === "pacifiquefashaho.github.io";
  const language = document.documentElement.lang.toLowerCase().startsWith("fr")
    ? "fr"
    : "en";
  const privacySignal = navigator.globalPrivacyControl === true
    || navigator.doNotTrack === "1"
    || window.doNotTrack === "1";

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    window.dataLayer.push(arguments);
  }

  if (isProduction && !privacySignal) {
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted"
    });
    gtag("set", "allow_google_signals", false);
    gtag("set", "allow_ad_personalization_signals", false);
    gtag("js", new Date());
    gtag("config", measurementId, { send_page_view: false });
    gtag("event", "page_view", {
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_path: window.location.pathname,
      page_language: language
    });

    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(googleTag);
  }

  function track(action, target) {
    if (!action || !target) return;

    const event = {
      event: "recruiter_conversion",
      action,
      target,
      language,
      page: window.location.pathname
    };

    window.dispatchEvent(new CustomEvent("portfolio:conversion", { detail: event }));

    if (isProduction && !privacySignal) {
      gtag("event", action, {
        event_category: "recruiter_conversion",
        conversion_target: target,
        page_language: language,
        page_path: window.location.pathname
      });
    }

    if (typeof window.portfolioAnalyticsSink === "function") {
      window.portfolioAnalyticsSink(Object.freeze({ ...event }));
    }
  }

  function classifyLink(link) {
    const href = link.getAttribute("href") || "";
    const normalized = href.toLowerCase();

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
    if (!link) return;

    const conversion = classifyLink(link);
    if (conversion) track(...conversion);
  });

  window.portfolioAnalytics = Object.freeze({ track });
})();

(function initializeQuickAssistantIntentEngine(globalScope) {
  "use strict";

  const FALLBACK_INTENT = "fallback";

  const intentRules = Object.freeze([
    Object.freeze({
      intent: "opportunity",
      terms: Object.freeze([
        "job",
        "opportunity",
        "position",
        "role",
        "career",
        "hire",
        "hiring",
        "recruit",
        "recruiter",
        "recruiting",
        "availability",
        "resume",
        "cv",
        "experience",
        "intern",
        "internship",
        "employment",
        "emploi",
        "opportunite",
        "candidature",
        "embauche",
        "disponibilite",
        "recrutement",
        "recruteur",
        "stage"
      ])
    }),
    Object.freeze({
      intent: "field",
      terms: Object.freeze([
        "kobo",
        "kobotoolbox",
        "odk",
        "field data",
        "fieldwork",
        "terrain",
        "collecte",
        "enquete"
      ])
    }),
    Object.freeze({
      intent: "dashboard",
      terms: Object.freeze([
        "dashboard",
        "reporting",
        "tableau de bord",
        "kpi",
        "power bi",
        "visualization",
        "visualisation"
      ])
    }),
    Object.freeze({
      intent: "support",
      terms: Object.freeze([
        "it support",
        "help desk",
        "helpdesk",
        "desktop support",
        "technical support",
        "support",
        "computer",
        "laptop",
        "desktop",
        "printer",
        "network",
        "internet",
        "wifi",
        "wi fi",
        "connectivity",
        "troubleshooting",
        "not working",
        "not opening",
        "cannot connect",
        "error",
        "issue",
        "problem",
        "informatique",
        "ordinateur",
        "portable",
        "imprimante",
        "reseau",
        "internet",
        "connexion",
        "connectivite",
        "depannage",
        "support technique",
        "technicien support",
        "ne fonctionne pas",
        "impossible de se connecter",
        "erreur",
        "probleme",
        "panne"
      ])
    }),
    Object.freeze({
      intent: "data",
      terms: Object.freeze([
        "data",
        "dataset",
        "spreadsheet",
        "excel",
        "cleaning",
        "analysis",
        "sql",
        "python",
        "donnee",
        "donnees",
        "classeur",
        "nettoyage",
        "analyse"
      ])
    })
  ]);

  const knownIntents = new Set([
    ...intentRules.map((rule) => rule.intent),
    FALLBACK_INTENT
  ]);

  function normalizeAssistantText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function containsTerm(normalizedMessage, term) {
    const normalizedTerm = normalizeAssistantText(term);

    if (!normalizedMessage || !normalizedTerm) {
      return false;
    }

    return ` ${normalizedMessage} `.includes(` ${normalizedTerm} `);
  }

  function classifyAssistantIntent(message) {
    const normalizedMessage = normalizeAssistantText(message);

    if (!normalizedMessage) {
      return FALLBACK_INTENT;
    }

    const matchedRule = intentRules.find((rule) =>
      rule.terms.some((term) => containsTerm(normalizedMessage, term))
    );

    return matchedRule ? matchedRule.intent : FALLBACK_INTENT;
  }

  function isAssistantIntent(value) {
    return knownIntents.has(value);
  }

  const intentEngine = Object.freeze({
    classify: classifyAssistantIntent,
    isKnownIntent: isAssistantIntent,
    normalize: normalizeAssistantText
  });

  globalScope.QuickAssistantIntents = intentEngine;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = intentEngine;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);

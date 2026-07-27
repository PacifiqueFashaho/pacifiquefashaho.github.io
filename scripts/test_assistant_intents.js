"use strict";

const assert = require("node:assert/strict");
const intentEngine = require("../assets/js/assistant-intents.js");

const classificationCases = [
  ["I am recruiting for an IT Support position.", "opportunity"],
  ["I want to discuss an IT Support internship.", "opportunity"],
  ["Je recrute pour un stage en support informatique.", "opportunity"],
  ["My internet connection is not working.", "support"],
  ["Mon imprimante affiche une erreur réseau.", "support"],
  ["I need a Power BI dashboard with five KPIs.", "dashboard"],
  ["Je souhaite créer un tableau de bord.", "dashboard"],
  ["Please clean this Excel dataset.", "data"],
  ["J’ai besoin d’une analyse de données.", "data"],
  ["I need help with a Kobo field-data form.", "field"],
  ["La collecte de données de terrain est bloquée.", "field"],
  ["I have an international inquiry.", "fallback"],
  ["Bonjour, je souhaite vous écrire.", "fallback"],
  ["", "fallback"]
];

classificationCases.forEach(([message, expectedIntent]) => {
  assert.equal(
    intentEngine.classify(message),
    expectedIntent,
    `Expected "${message}" to resolve to "${expectedIntent}".`
  );
});

assert.equal(intentEngine.isKnownIntent("support"), true);
assert.equal(intentEngine.isKnownIntent("fallback"), true);
assert.equal(intentEngine.isKnownIntent("unknown"), false);
assert.equal(
  intentEngine.normalize("Données / FIELD-data"),
  "donnees field data"
);

console.log(
  `Quick Assistant intent tests passed: ${classificationCases.length} classification cases.`
);

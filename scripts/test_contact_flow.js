// Offline regression checks: no provider requests or real messages are sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const engine = require('../assets/js/assistant-intents.js');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/contact-assistant.js'), 'utf8');

async function run(language) {
  const elements = new Map();
  let document, copied = '', requests = 0, response = 'success';
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const attrs = {}, listeners = {};
    const e = { id, value: '', textContent: '', dataset: {}, hidden: true, disabled: false,
      validity: { typeMismatch: false }, maxLength: 1200, isConnected: true,
      classList: { add() {}, remove() {}, toggle() {} },
      addEventListener(type, callback) { listeners[type] = callback; },
      async fire(type, extra = {}) { return listeners[type]?.({ preventDefault() {}, stopImmediatePropagation() {}, ...extra }); },
      setAttribute(k, v) { attrs[k] = v; }, getAttribute(k) { return attrs[k]; }, removeAttribute(k) { delete attrs[k]; },
      focus() { document.activeElement = e; }, scrollIntoView() {},
      getClientRects() { return [{}]; }, contains(x) { return x === e; }, querySelectorAll() { return []; },
      reset() { for (const id of ['contactName','contactEmail','contactSubject','contactMessage']) element(id).value = ''; }
    };
    elements.set(id, e); return e;
  }
  const suggestions = ['employment','collaboration','data','support','automation'].map(id => {
    const e = element('topic-' + id); e.dataset.category = id; return e;
  });
  let ready;
  document = { documentElement: { lang: language }, body: element('body'), activeElement: null,
    getElementById: element,
    querySelectorAll(selector) { return selector === '.chat-suggestion' ? suggestions : []; },
    addEventListener(type, callback) { if (type === 'DOMContentLoaded') ready = callback; }
  };
  element('contactForm').dataset.endpoint = 'https://formspree.io/f/test-only';
  const context = { document, console: { error() {} }, navigator: { clipboard: { async writeText(v) { copied = v; } } },
    FormData: class {}, setTimeout, clearTimeout,
    fetch: async () => { requests++; if (response === 'network') throw Error('offline'); return { ok: response === 'success', json: async () => ({ errors: [{ message: 'test error' }] }) }; },
    window: { QuickAssistantIntents: engine, isSecureContext: true, matchMedia: () => ({matches:true}),
      requestAnimationFrame: callback => callback(), setTimeout: () => 1, clearTimeout() {}, addEventListener() {} }
  };
  vm.runInNewContext(source, context); ready();
  await element('contactForm').fire('submit');
  assert.equal(requests, 0); assert.match(element('contactFormStatus').textContent, /4/);
  for (const suggestion of suggestions) {
    await suggestion.fire('click'); await element('chatAssistantForm').fire('submit');
    assert.ok(element('chatMessageInput').value.length > 100);
    assert.equal(element('chatCopyMessage').disabled, false);
    assert.ok(element('chatEmailLink').href.startsWith('mailto:'));
  }
  await element('chatCopyMessage').fire('click');
  assert.equal(copied, element('chatMessageInput').value);
  const draft = element('chatMessageInput').value;
  const subjectBefore = element('chatEmailLink').href;
  await suggestions[0].fire('click');
  assert.equal(element('chatEmailLink').href, subjectBefore, 'Changing a topic must not relabel an existing draft');
  await element('chatContactFormLink').fire('click');
  assert.equal(element('contactMessage').value, draft);
  assert.match(element('contactSubject').value, language === 'fr' ? /automatisation/ : /Automation/);
  element('contactName').value = 'QA Example'; element('contactEmail').value = 'qa@example.invalid';
  for (response of ['network', 'service']) {
    await element('contactForm').fire('submit');
    assert.match(element('contactFormStatus').textContent, /email/);
    assert.equal(element('contactSubmitButton').disabled, false);
    assert.equal(element('contactMessage').value, draft, 'Failure preserves the draft');
  }
  response = 'success'; await element('contactForm').fire('submit');
  assert.equal(element('contactMessage').value, ''); assert.equal(requests, 3);
  assert.equal(element('contactSubmitButton').disabled, false);
  assert.doesNotMatch(source, /WhatsApp|wa\.me|internship|\bstage\b/);
}
(async () => { await run('en'); await run('fr'); console.log('Contact flow checks passed in EN/FR: drafts, copy, handoff, validation, network/service failure, and success.'); })().catch(e => { console.error(e); process.exitCode = 1; });

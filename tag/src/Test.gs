/**
 * Test.gs – Integration and unit tests for TAG
 * Run `runAllTests()` to verify all core behaviors.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Assertion Helpers
// ─────────────────────────────────────────────────────────────────────────────
function assertTrue(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + msg);
}
function assertFalse(cond, msg) {
  if (cond) throw new Error('Assertion failed: ' + msg);
}
function assertEquals(actual, expected, msg) {
  if (actual !== expected) throw new Error(
    'Assertion failed: ' + msg + ' (got ' + actual + ', expected ' + expected + ')'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: Token Generation & Lookup
// ─────────────────────────────────────────────────────────────────────────────
function testGenerateAndLookup() {
  const email = 'test+' + Date.now() + '@example.com';
  const site  = 'https://example.com/test';
  const token = generateToken(email, site);
  storeToken(email, site, token);

  const rec = lookupToken(token);
  assertTrue(rec !== null, 'lookupToken should find the record');
  assertEquals(rec.email, email, 'Stored email should match');
  assertEquals(rec.site, site, 'Stored site should match');
  assertEquals(rec.token, token, 'Stored token should match');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: JSON Endpoint (valid + invalid tokens)
// ─────────────────────────────────────────────────────────────────────────────
function testJsonEndpoint() {
  const email = 'json+' + Date.now() + '@example.com';
  const site  = ScriptApp.getService().getUrl();
  const token = generateToken(email, site);
  storeToken(email, site, token);

  // Simulate JSON endpoint via doGet
  const goodOut = doGet({ parameter: { format: 'json', token: token } });
  const goodText = goodOut.getContent().trim();
  assertTrue(goodText.charAt(0) === '{', 'Expected JSON for valid token, got: ' + goodText.slice(0,50));
  const goodData = JSON.parse(goodText);
  assertTrue(goodData.valid === true, 'JSON valid should be true for good token');
  assertEquals(goodData.record.email, email, 'JSON record.email matches stored email');

  const badOut = doGet({ parameter: { format: 'json', token: 'INVALID_TOKEN' } });
  const badText = badOut.getContent().trim();
  assertTrue(badText.charAt(0) === '{', 'Expected JSON for invalid token, got: ' + badText.slice(0,50));
  const badData = JSON.parse(badText);
  assertFalse(badData.valid, 'JSON valid should be false for invalid token');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: validateTagToken(token)
// ─────────────────────────────────────────────────────────────────────────────
function testValidateTagToken() {
  const email = 'val+' + Date.now() + '@example.com';
  const site  = 'https://example.com/validate';
  const token = generateToken(email, site);
  storeToken(email, site, token);

  assertTrue(validateTagToken(token), 'validateTagToken should return true for valid token');
  let threw = false;
  try {
    validateTagToken('NO_SUCH_TOKEN');
  } catch (e) {
    threw = true;
  }
  assertTrue(threw, 'validateTagToken should throw for invalid token');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test: doGet HTML Routing
// ─────────────────────────────────────────────────────────────────────────────
function testDoGetHtml() {
  // No parameters => gateway
  let out = doGet({ parameter: {} }).getContent();
  assertTrue(out.indexOf('<form') !== -1, 'doGet() without token should serve gateway form');

  // Valid token => success.html or denied.html
  const email = 'html+' + Date.now() + '@example.com';
  const site  = ScriptApp.getService().getUrl();
  const token = generateToken(email, site);
  storeToken(email, site, token);
  out = doGet({ parameter: { token: token } }).getContent();
  assertTrue(
    out.includes('Access Granted') || out.includes('Access Denied'),
    'doGet() with token should serve success or denied page'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Run All Tests
// ─────────────────────────────────────────────────────────────────────────────
function runAllTests() {
  testGenerateAndLookup();
  testJsonEndpoint();
  testValidateTagToken();
  testDoGetHtml();
  Logger.log('✅ All TAG tests passed!');
}


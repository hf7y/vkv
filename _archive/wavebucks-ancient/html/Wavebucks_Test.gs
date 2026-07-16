// Wavebucks_Test.gs – Automated tests for Wavebucks + TAG integration

/**
 * 1) No-token path should render the login form (index view).
 */
function testDoGetIndexView() {
  const output = doGet({ parameter: {} });
  const html = output.getContent();
  const hasLogin = html.includes('<h1>WaveBucks');
  Logger.log('testDoGetIndexView → login view contains title? ' + hasLogin);
}

/**
 * 2) Valid-token path should render the balance viewer (app view).
 *    We stub validateTagToken() to simulate success.
 */
function testDoGetValidToken() {
  const originalValidate = validateTagToken;
  validateTagToken = function(token) { return true; };

  try {
    const output = doGet({ parameter: { token: 'VALID_TOKEN' } });
    const html = output.getContent();
    const hasGrid = html.includes('id="iso-grid"');
    Logger.log('testDoGetValidToken → app view contains iso-grid? ' + hasGrid);
  } finally {
    validateTagToken = originalValidate;
  }
}

/**
 * 3) Invalid-token path should render the denied view.
 *    We stub validateTagToken() to throw an error.
 */
function testDoGetInvalidToken() {
  const originalValidate = validateTagToken;
  validateTagToken = function(token) { throw new Error('Invalid or expired link.'); };

  try {
    const output = doGet({ parameter: { token: 'BAD_TOKEN' } });
    const html = output.getContent();
    const hasDenied = html.toLowerCase().includes('access denied') || html.includes('<h1>Denied');
    Logger.log('testDoGetInvalidToken → denied view contains denial message? ' + hasDenied);
  } catch (e) {
    Logger.log('testDoGetInvalidToken → doGet threw exception: ' + e.message);
  } finally {
    validateTagToken = originalValidate;
  }
}

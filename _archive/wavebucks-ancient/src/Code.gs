/**
 * Code.gs – Wavebucks Web App entry point and server logic
 */

/**
 * doGet(e)
 * Safely handles missing `e.parameter`, then:
 * - No token    → serves login (index.html) with WAVE_APP_URL
 * - Valid token → serves app   (app.html) with token
 * - Invalid     → serves bad‑token.html
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  const token  = params.token;

  if (token) {
    // Validate via TAG; on failure show denied page
    try {
      validateTagToken(token);
    } catch (err) {
      return HtmlService.createHtmlOutputFromFile('bad-token')
                        .setTitle('Access Denied');
    }
    // Valid token → show app.html
    const tpl = HtmlService.createTemplateFromFile('app');
    tpl.token = token;
    return tpl.evaluate()
              .addMetaTag('viewport','width=device-width, initial-scale=1')
              .setTitle('WaveBucks App');
  }

  // No token → show index.html and inject WAVE_APP_URL
  const tpl = HtmlService.createTemplateFromFile('index');
  tpl.waveAppUrl = ScriptApp.getService().getUrl();
  return tpl.evaluate()
            .addMetaTag('viewport','width=device-width, initial-scale=1')
            .setTitle('WaveBucks Login');
}


/**
 * getUserBalanceByEmail(email)
 * Looks up the given email in the Balances sheet.
 */
function getUserBalanceByEmail(email) {
  const sh = getBalancesSheet();
  const rows = sh.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase().trim() === email.toLowerCase().trim()) {
      return Number(rows[i][1]);
    }
  }
  throw new Error(`No balance found for email: ${email}`);
}

/**
 * getUserBalanceByToken(token)
 * Delegates to TAG library to map token → email, then retrieves that balance.
 */
function getUserBalanceByToken(token) {
  const email   = getEmailFromToken(token);
  return getUserBalanceByEmail(email);
}

/**
 * validateTagToken(token)
 * Delegates actual validation to the TAG library. Throws if invalid.
 */
function validateTagToken(token) {
  return TAG.validateTagToken(token);
}

/**
 * getEmailFromToken(token)
 * Delegates to the TAG library to generate a token, store it, and email the magic link.
 */
function sendAccessEmail(email, targetSite) {
    return TAG.sendAccessEmail(email, targetSite);
}

/**
 * getEmailFromToken(token)
 * Delegates to the TAG library to map token → email.
 */
function getEmailFromToken(token) {
  return TAG.getEmailFromToken(token);
}

/**
 * include(filename)
 * HTML templating helper: <?!= include('filename') ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

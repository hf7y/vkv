/**
 * Code.gs – Main entry point for TAG
 * Handles routing, JSON responses, and email dispatch.
 */

// const SHEET_ID   = 'YOUR_SPREADSHEET_ID_HERE'; // in sheetConfig.gs
// const SHEET_NAME = 'Tokens'; // in sheetConfig.gs

/**
 * Include HTML templates.
 * Usage in HTML files: <?!= include('filename') ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * doGet(e) – Web App entry point.
 * - ?format=json&token=XYZ → JSON response { valid, record }
 * - ?token=XYZ          → serve success.html or denied.html
 * - no parameters       → serve gateway.html
 */
function doGet(e) {
  const token = e.parameter.token;
  const fmt   = e.parameter.format;

  // JSON health‑check mode
  if (fmt === 'json') {
    const ss   = SpreadsheetApp.openById(SHEET_ID);
    const rows = ss.getSheetByName(SHEET_NAME)
                   .getDataRange()
                   .getValues()
                   .slice(1);  // skip header row

    const recRow = rows.find(r => String(r[2]).trim() === String(token).trim());
    const record = recRow
      ? { email: recRow[0], site: recRow[1], token: recRow[2], timestamp: recRow[3] }
      : null;

    return ContentService
      .createTextOutput(JSON.stringify({
        valid:  !!record,
        record: record
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // HTML gateway mode
  if (token) {
    const isValid = (() => {
      try {
        return validateTagToken(token);
      } catch (_) {
        return false;
      }
    })();

    const page = isValid ? 'success' : 'denied';
    return HtmlService.createHtmlOutputFromFile(page)
                      .setTitle(`TAG – ${page.charAt(0).toUpperCase() + page.slice(1)}`);
  }

  // No token → show email‑request gateway
  const tpl = HtmlService.createTemplateFromFile('gateway');
  tpl.gatewayURL = GATEWAY_URL;
  return tpl.evaluate().setTitle('TAG – Access Gateway');
}

/**
 * sendAccessEmail(email, targetSite)
 * Generates a token, stores it, and emails the magic link.
 *
 * @param {string} email      Recipient email
 * @param {string} targetSite Base URL for the link (must include /exec)
 */
function sendAccessEmail(email, targetSite) {
  const token = generateToken(email, targetSite);
  storeToken(email, targetSite, token);

  const link    = `${targetSite}?token=${encodeURIComponent(token)}`;
  const subject = `Your Access Link for ${targetSite}`;
  const body    = [
    `Hello,`,
    ``,
    `Here is your access link:`,
    link,
    ``,
    `If you did not request this, please ignore this email.`,
    ``,
    `– The TAG System`
  ].join('\n');

  MailApp.sendEmail(email, subject, body);
}

/**
 * validateTagToken(token)
 * Returns true if the token exists in the sheet; otherwise throws an Error.
 *
 * @param {string} token
 * @returns {boolean}
 */
function validateTagToken(token) {
  const ss   = SpreadsheetApp.openById(SHEET_ID);
  const data = ss.getSheetByName(SHEET_NAME)
                 .getDataRange()
                 .getValues()
                 .map(r => String(r[2]).trim());
  if (data.includes(String(token).trim())) {
    return true;
  }
  throw new Error('Invalid or expired link.');
}

/**
 * getEmailFromToken(token)
 * Returns the email associated with the given token.
 *
 * @param {string} token
 * @returns {string}
 */
function getEmailFromToken(token) {
  const record = lookupToken(token);
  if (!record) {
    throw new Error('Invalid token.');
  }
  return record.email;
}

/**
 * lookupToken(token)
 * Internal helper to retrieve the full record for a token.
 *
 * @param {string} token
 * @returns {{email:string, site:string, token:string, timestamp:string}|null}
 */
function lookupToken(token) {
  const ss   = SpreadsheetApp.openById(SHEET_ID);
  const rows = ss.getSheetByName(SHEET_NAME)
                 .getDataRange()
                 .getValues()
                 .slice(1);  // skip header

  const match = rows.find(r => String(r[2]).trim() === String(token).trim());
  return match
    ? { email: match[0], site: match[1], token: match[2], timestamp: match[3] }
    : null;
}

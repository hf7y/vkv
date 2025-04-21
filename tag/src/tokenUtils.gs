/**
 * tokenUtils.gs – Helper functions for managing TAG access tokens
 */

// const SHEET_ID   = 'YOUR_SPREADSHEET_ID_HERE'; // in sheetConfig.gs
// const SHEET_NAME = 'Tokens'; // in sheetConfig.gs

/**
 * generateToken(email, site)
 * Creates a unique token. Currently uses UUID.
 *
 * @param {string} email  – User’s email address
 * @param {string} site   – Target site or resource URL
 * @return {string}       – Newly generated token
 */
function generateToken(email, site) {
  return Utilities.getUuid();
}

/**
 * storeToken(email, site, token)
 * Appends a new row in the Tokens sheet with the token metadata.
 *
 * @param {string} email  – User’s email address
 * @param {string} site   – Target site or resource URL
 * @param {string} token  – Token to be stored
 */
function storeToken(email, site, token) {
  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEET_NAME);
  sheet.appendRow([ email, site, token, new Date() ]);
}

/**
 * lookupToken(token)
 * Searches the Tokens sheet for a matching token.
 *
 * @param {string} token
 * @return {{email:string, site:string, token:string, timestamp:Date}|null}
 *   – Metadata object if found, otherwise null
 */
function lookupToken(token) {
  const rows = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEET_NAME)
    .getDataRange()
    .getValues()
    .slice(1);  // skip header row

  for (let row of rows) {
    if (String(row[2]).trim() === String(token).trim()) {
      return {
        email:     row[0],
        site:      row[1],
        token:     row[2],
        timestamp: row[3]
      };
    }
  }
  return null;
}

/**
 * debugLookupToken(token)
 * Logs the raw lookup result for debugging purposes.
 *
 * @param {string} token
 * @return {object|null}
 */
function debugLookupToken(token) {
  const rec = lookupToken(token);
  Logger.log('🔍 lookupToken("%s") → %s', token, JSON.stringify(rec));
  return rec;
}

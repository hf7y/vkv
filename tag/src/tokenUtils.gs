/**
 * tokenUtils.gs – Helper functions for managing access tokens
 */

/**
 * Generate a unique access token using UUID
 * @param {string} email - User email address
 * @param {string} site - Target site or resource
 * @return {string} - Unique token string
 */
function generateToken(email, site) {
  return Utilities.getUuid(); // You can customize this if needed
}

/**
 * Store token info in the shared token registry sheet
 * @param {string} email - Email address associated with the token
 * @param {string} site - Target site/resource
 * @param {string} token - Token to store
 */
function storeToken(email, site, token) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([email, site, token, new Date()]);
}

/**
 * Lookup token in the token registry sheet
 * @param {string} token - Token to validate
 * @return {object|null} - Object with email and site if valid, otherwise null
 */
function lookupToken(token) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][TOKEN_COL] === token) {
      return {
        email: data[i][EMAIL_COL],
        site: data[i][SITE_COL],
        token: data[i][TOKEN_COL],
        timestamp: data[i][TIMESTAMP_COL]
      };
    }
  }
  return null;
}

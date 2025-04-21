/**
 * sheetConfig.gs – Spreadsheet settings for Wavebucks balances & logs
 */

// Spreadsheet IDs and sheet names
const SHEET_ID = '1LOIRjKvyu4jr-WOvyvvZToNxL2M8Wfop5nDKu023hew';
const BALANCES_SHEET = 'Balances';
const TRANSACTIONS_SHEET = 'Transactions';
const LOG_SHEET = 'Logs';

// Column indices (zero-based) for Balances sheet
const BAL_EMAIL_COL   = 0;  // "Email Address"
const BALANCE_COL     = 1;  // "Balance"

// Column headers expected in Transactions sheet
// "Timestamp", "Action", "Amount", "Password", "Email Address", "Previous Balance", "Processed"

// Utility: returns the SpreadsheetApp Spreadsheet object
function getWorkbook() {
  return SpreadsheetApp.openById(SHEET_ID);
}

// Utility: get a named sheet by constant
function getSheet(name) {
  return getWorkbook().getSheetByName(name);
}

function getBalancesSheet() {
  return getWorkbook().getSheetByName('Balances');
}

const WAVE_APP_URL = 'https://script.google.com/macros/s/AKfycbxtWc-6_T5rADP0-1s-DoYw02mlgOxtGOKyGfp1YzBL/dev'; // ← replace with subdomain when ready
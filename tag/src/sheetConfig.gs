/**
 * sheetConfig.gs – Spreadsheet settings for TAG tokens
 */

const SHEET_ID        = '1e3Rn_mP9UctJT3qa1oDmy6weL3XlNa40Z0al4bl3bFU';
const SHEET_NAME      = 'Tokens';
const LOG_SHEET_NAME = 'Logs';


// Column indices (zero-based)
const EMAIL_COL       = 0;
const SITE_COL        = 1;
const TOKEN_COL       = 2;
const TIMESTAMP_COL   = 3;

// should not be hiding in sheetConfig
const gatewayURL = 'https://script.google.com/macros/s/AKfycbwo5IOvzynaamLRyotOy409QV08Xkou8MJJuVEW0didsRZlsjhRl_MRoLQTuWfEEAGmSA/exec'
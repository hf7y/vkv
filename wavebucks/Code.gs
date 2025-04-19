const SPREADSHEET_ID = '1LOIRjKvyu4jr-WOvyvvZToNxL2M8Wfop5nDKu023hew';

function doGet(e) {
  const token = e.parameter.token;

  if (token) {
    const template = HtmlService.createTemplateFromFile('app');
    template.token = token;
    return template.evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle('WaveBucks App');
  } else {
    return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle('WaveBucks Login');
  }
}

/**
 * Called from the client to fetch the signed‑in user’s balance.
 */
function getUserBalance() {
  // 1) get the email of whoever’s signed in
  const email = Session.getActiveUser().getEmail().toLowerCase();
  // const email = getUserEmail();
  if (!email) {
    throw new Error('Unable to determine your email. Make sure you’re signed in.');
  }

  // 2) open the Balances sheet and scan for the email
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh    = ss.getSheetByName('Balances');
  const data  = sh.getDataRange().getValues();     // header + rows
  const hdr   = data.shift();
  const col   = hdr.indexOf('Email Address');
  const balIx = hdr.indexOf('Balance');

  for (let row of data) {
    if (String(row[col]).toLowerCase() === email) {
      return row[balIx];
    }
  }
  // not found → zero or “no account”
  return 0;
}

function getUserBalanceByEmail(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Balances');
  const data = sheet.getDataRange().getValues();

  for (let row of data) {
    if (row[0].toString().toLowerCase().trim() === email.toLowerCase().trim()) {
      return row[1]; // Make sure this is the balance column
    }
  }

  throw new Error(`No balance found for email: ${email}`);
}

function getUserBalanceByToken(token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Balances');
  if (!sheet) return "❌ Sheet not found.";

  const data = sheet.getDataRange().getValues();
  const inputToken = String(token).trim();

  let debugLog = [`🔍 Looking for token: "${inputToken}"`];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const sheetToken = String(row[1]).trim();

    debugLog.push(`Row ${i + 1}:`);
    debugLog.push(`  Sheet token: "${sheetToken}"`);
    debugLog.push(`  Match? ${sheetToken === inputToken}`);

    if (sheetToken === inputToken) {
      debugLog.push(`✅ MATCH: Returning balance ${row[2]}`);
      return row[2]; // ✅ comment this out if you want to return debugLog.join('\n') instead
    }
  }

  // ⛔ If nothing matched, return debug info instead of throwing
  return debugLog.join('\n');
}



/**
 * Include helper to insert fragment content.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getUserBalanceByToken(token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Balances');
  const data = sheet.getDataRange().getValues();

  for (let row of data) {
    if (row[0].toString().trim() === token.trim()) {
      return row[1];  // assuming column 2 holds the balance
    }
  }

  throw new Error("Token not found in balance sheet.");
}

/**
 * Share your Balances sheet so anyone
 * (or anyone with the link) can view it.
 */
function shareSheetPublicly() {
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  // Open the Drive file for your spreadsheet
  const file = DriveApp.getFileById("1LOIRjKvyu4jr-WOvyvvZToNxL2M8Wfop5nDKu023hew");

  // Option A: Anyone on the internet (fully public)
  file.setSharing(
    DriveApp.Access.ANYONE,
    DriveApp.Permission.VIEW
  );

  // — or — 

  // Option B: Anyone *with the link* (unlisted)
  // file.setSharing(
  //   DriveApp.Access.ANYONE_WITH_LINK,
  //   DriveApp.Permission.VIEW
  // );

  Logger.log('Sheet is now shared: ' + file.getSharingAccess());
}

function debugToken(token) {
  const email = Utilities.newBlob(Utilities.base64DecodeWebSafe(token)).getDataAsString();
  Logger.log(`Decoded email: ${email}`);
  return email;
}

function migrateEmailToToken() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Balances');
  const data = sheet.getDataRange().getValues();

  // Optional: create backup sheet
  // const backup = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Balances_Backup');
  // backup.getRange(1, 1, data.length, data[0].length).setValues(data);

  const updated = data
    .filter(row => row[0]) // skip blank emails
    .map(row => [
      Utilities.base64EncodeWebSafe(row[0].toString().trim()), // token
      row[1]
    ]);

  sheet.clearContents();
  sheet.getRange(1, 1, updated.length, 2).setValues(updated);

  Logger.log('✅ Migration complete. %s rows updated.', updated.length);
}

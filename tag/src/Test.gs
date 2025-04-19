/**
 * Test.gs – Manual test harness for Tokenized Access Gateway (TAG)
 * Run each test individually from the Apps Script editor.
 */

// === TEST: Generate and Store Token ===
function testGenerateAndStoreToken() {
  const email = "test@example.com";
  const site = "https://example.com/test";
  const token = generateToken(email, site);
  Logger.log("Generated token: " + token);

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const found = data.some(row => row[0] === email && row[1] === site && row[2] === token);
  
  Logger.log("Token found in sheet: " + found);
}

// === TEST: Lookup Token ===
function testLookupToken() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const token = sheet.getRange(2, 3).getValue(); // assuming there's a token in row 2, col 3

  const match = lookupToken(token);
  if (match) {
    Logger.log("Lookup success: " + JSON.stringify(match));
  } else {
    Logger.log("Token not found");
  }
}

// === TEST: Send Access Email ===
function testSendAccessEmail() {
  const email = "test@example.com";
  const site = "https://example.com/test";
  sendAccessEmail(email, site);
  Logger.log("Email sent to: " + email);
}

// === TEST: doGet with valid token ===
function testDoGetValid() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const token = sheet.getRange(2, 3).getValue(); // assume valid token in sheet

  const e = { parameter: { token: token } };
  const output = doGet(e);
  Logger.log(output.getContent());
}

// === TEST: doGet with invalid token ===
function testDoGetInvalid() {
  const e = { parameter: { token: "invalid-token-1234" } };
  const output = doGet(e);
  Logger.log(output.getContent());
}

// === TEST: doGet with missing token ===
function testDoGetMissing() {
  const e = { parameter: {} };
  const output = doGet(e);
  Logger.log(output.getContent());
}

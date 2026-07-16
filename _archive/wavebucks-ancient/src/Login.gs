/**
 * Hash a string using SHA-256 and return hex string.
 */
function hashString(str) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str);
  return bytes.map(b => ('0' + ((b < 0 ? b + 256 : b).toString(16))).slice(-2)).join('');
}

/**
 * Validate credentials and issue a session token.
 * Stores token->email in user cache for 30 minutes.
 */
function checkCredentials(email, password) {
  email = email.toLowerCase().trim();
  const hash = hashString(password);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Balances');
  const data = sheet.getDataRange().getValues(); // header + rows

  // find matching row
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email && data[i][2] === hash) {
      // generate token and cache it
      const token = Utilities.getUuid();
      CacheService.getUserCache().put(token, email, 30 * 60);
      return token;
    }
  }
  return null;
}

// /**
//  * Given a session token, return the user's balance or throw if invalid.
//  */
// function getBalanceWithToken(token) {
//   const email = CacheService.getUserCache().get(token);
//   if (!email) {
//     throw new Error('Not authenticated or session expired. Please log in again.');
//   }
//   const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Balances');
//   const data = sheet.getDataRange().getValues();
//   for (let i = 1; i < data.length; i++) {
//     if (String(data[i][0]).toLowerCase().trim() === email) {
//       return Number(data[i][1]);
//     }
//   }
//   return 0;
// }

/**
 * Create a new user account if the email isn't already registered.
 * Returns a session token on success, or throws an error if the email exists.
 */
function signUpUser(email, password) {
  email = email.toLowerCase().trim();
  const pwHash = hashString(password);
  const sheet  = SpreadsheetApp.openById("1LOIRjKvyu4jr-WOvyvvZToNxL2M8Wfop5nDKu023hew")
                         .getSheetByName('Balances');
  const data   = sheet.getDataRange().getValues(); // header + rows

  // Check for existing email
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email) {
      throw new Error('An account with that email already exists.');
    }
  }

  // Append new user row: [ Email, Balance=0, Password Hash, '', '', '' ]
  sheet.appendRow([ email, 0, pwHash, '', '', '' ]);

  // Generate and cache session token just like checkCredentials
  const token = Utilities.getUuid();
  CacheService.getUserCache().put(token, email, 60 * 60 * 24); // 24h
  return token;
}

function requestLoginLink() {
  const email = document.getElementById('email').value;
  document.getElementById('error-msg').innerText = '';

  // Hash the email for security/privacy purposes
  const hashedEmail = btoa(email);

  google.script.run
    .withSuccessHandler(response => {
      if (response.success) {
        document.getElementById('error-msg').innerText = 'Login link sent to your email.';
      } else {
        document.getElementById('error-msg').innerText = 'Error sending login link. Please try again.';
      }
    })
    .withFailureHandler(err => {
      document.getElementById('error-msg').innerText = err.message;
    })
    .sendLoginLink(hashedEmail);
}

function sendLoginLink(hashedEmail) {
  const email = Utilities.newBlob(Utilities.base64DecodeWebSafe(hashedEmail)).getDataAsString();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tokens');
  const data = sheet.getDataRange().getValues();

  // Check if token already exists
  for (let row of data) {
    if (row[0].toLowerCase().trim() === email.toLowerCase().trim()) {
      return sendLink(email, row[1]);
    }
  }

  // Generate new token
  const token = generateToken();
  sheet.appendRow([email, token]);

  return sendLink(email, token);
}

function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function sendLink(email, token) {
  const scriptUrl = ScriptApp.getService().getUrl();
  const loginLink = `${scriptUrl}?token=${token}`;

  GmailApp.sendEmail(email, "Your Login Link", 
    `Use this link to log in:\n\n${loginLink}`);

  return { success: true };
}
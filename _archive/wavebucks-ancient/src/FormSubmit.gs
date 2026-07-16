/**
 * FormSubmit.gs – Processes new transactions from Google Form
 * Trigger: onFormSubmit
 */

/**
 * Called automatically on form submit to update balances and transactions.
 * @param {Object} e Form submit event with namedValues & range
 */
function onFormSubmit(e) {
  const named = e.namedValues;
  const ts = named['Timestamp'][0];
  const action = named['Action'][0];         // "Deposit" or "Withdraw"
  const amount = parseFloat(named['Amount'][0]);
  const password = named['Password'][0];
  const email = named['Email Address'][0].toLowerCase().trim();

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const balSh = ss.getSheetByName('Balances');
  const txSh = ss.getSheetByName('Transactions');
  const txRow = e.range.getRow();

  // Load Balances header and data
  const balValues = balSh.getDataRange().getValues();
  const balHdr = balValues[0];
  const colEmail = balHdr.indexOf('Email Address');
  const colBalance = balHdr.indexOf('Balance');
  const colHash = balHdr.indexOf('Password Hash');
  const colLastAction = balHdr.indexOf('Last Action');
  const colAmt = balHdr.indexOf('Amount');
  const colTs = balHdr.indexOf('Timestamp');

  // Find existing balance row
  let balRow = null;
  for (let i = 1; i < balValues.length; i++) {
    if (String(balValues[i][colEmail]).toLowerCase().trim() === email) {
      balRow = i + 1; // sheet rows are 1-indexed
      break;
    }
  }

  // Hash password and compute previous balance
  const hash = hashString(password);
  let prevBalance = 0;
  if (balRow) {
    prevBalance = Number(balSh.getRange(balRow, colBalance + 1).getValue());
  }

  // Create or update Balances row
  if (!balRow) {
    // New user: initial balance
    const initial = action === 'Deposit' ? amount : -amount;
    balSh.appendRow([email, initial, hash, action, amount, ts]);
  } else {
    const storedHash = balSh.getRange(balRow, colHash + 1).getValue();
    if (hash !== storedHash) {
      Logger.log(`❌ Password mismatch for ${email}`);
      return;
    }
    const newBal = action === 'Deposit'
      ? prevBalance + amount
      : prevBalance - amount;
    balSh.getRange(balRow, colBalance + 1).setValue(newBal);
    balSh.getRange(balRow, colLastAction + 1).setValue(action);
    balSh.getRange(balRow, colAmt + 1).setValue(amount);
    balSh.getRange(balRow, colTs + 1).setValue(ts);
  }

  // Update Transactions row
  const txHdr = txSh.getDataRange().getValues()[0];
  const txColPassword = txHdr.indexOf('Password');
  const txColPrevBal = txHdr.indexOf('Previous Balance');
  const txColProcessed = txHdr.indexOf('Processed');

  txSh.getRange(txRow, txColPassword + 1).setValue(hash);
  txSh.getRange(txRow, txColPrevBal + 1).setValue(prevBalance);
  txSh.getRange(txRow, txColProcessed + 1).setValue(true);
}

/**
 * hashString(password)
 * Returns a SHA-256 hex digest of the input string.
 * @param {string} password
 * @return {string}
 */
function hashString(password) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return bytes.map(b => ('0' + (b < 0 ? b + 256 : b).toString(16)).slice(-2)).join('');
}


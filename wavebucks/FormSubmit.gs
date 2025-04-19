/**
 * Trigger this on form submit.
 * e.namedValues contains the form data by column header.
 * e.range.getRow() gives the row in Transactions where the form wrote the data.
 */
function onFormSubmit(e) {
  // 1) pull out the submitted values
  const ts       = e.namedValues['Timestamp'][0];
  const action   = e.namedValues['Action'][0];       // "Deposit" or "Withdraw"
  const amount   = parseFloat(e.namedValues['Amount'][0]);
  const password = e.namedValues['Password'][0];
  const email    = e.namedValues['Email Address'][0].toLowerCase().trim();

  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const balSh    = ss.getSheetByName('Balances');
  const txSh     = ss.getSheetByName('Transactions');
  const txRow    = e.range.getRow();                  // the row just added by the form

  // 2) load Balances header & data
  const balData    = balSh.getDataRange().getValues(); // includes header
  const balHeader  = balData[0];
  const colEmail      = balHeader.indexOf('Email Address');
  const colBalance    = balHeader.indexOf('Balance');
  const colHash       = balHeader.indexOf('Password Hash');
  const colLastAction = balHeader.indexOf('Last Action');
  const colAmt        = balHeader.indexOf('Amount');
  const colTs         = balHeader.indexOf('Timestamp');

  // 3) find existing Balances row for this email
  let balRow = -1;
  for (let i = 1; i < balData.length; i++) {
    if (String(balData[i][colEmail]).toLowerCase() === email) {
      balRow = i + 1;
      break;
    }
  }

  // 4) hash the submitted password (SHA‑256 → hex)
  const hash = hashString(password);

  // 5) compute previous balance (0 if new user)
  let prevBalance = 0;
  if (balRow > 0) {
    prevBalance = parseFloat(
      balSh.getRange(balRow, colBalance + 1).getValue()
    );
  }

  // 6) load Transactions header so we know where to write
  const txHeader      = txSh.getDataRange().getValues()[0];
  const txColPassword    = txHeader.indexOf('Password');
  const txColEmail    = txHeader.indexOf('Email Address');
  const txColPrevBalance = txHeader.indexOf('Previous Balance');
  const txColProcessed   = txHeader.indexOf('Processed');

  // 7) either create or update Balances
  if (balRow < 0) {
    // — new user: initial balance = +amount or -amount
    const initialBalance = action === 'Deposit' ? amount : -amount;
    balSh.appendRow([
      email,
      initialBalance,
      hash,
      action,
      amount,
      ts
    ]);
  } else {
    // — existing user: verify password
    const storedHash = balSh.getRange(balRow, colHash + 1).getValue();
    if (hash !== storedHash) {
      Logger.log(`❌ Password mismatch for ${email}`);
      return;  // do NOT mark processed
    }
    // — update balance & metadata
    const newBal = (action === 'Deposit')
      ? prevBalance + amount
      : prevBalance - amount;

    balSh.getRange(balRow, colBalance + 1).setValue(newBal);
    balSh.getRange(balRow, colLastAction + 1).setValue(action);
    balSh.getRange(balRow, colAmt + 1).setValue(amount);
    balSh.getRange(balRow, colTs + 1).setValue(ts);
  }

  // 8) finally, update the Transactions row:
  //    • replace the clear‑text password with the SHA‑256 hash  
  //    • write the previous balance  
  //    • mark it processed = TRUE
  txSh.getRange(txRow, txColPassword + 1)
      .setValue(hash);
  txSh.getRange(txRow, txColPrevBalance + 1)
      .setValue(prevBalance);
  txSh.getRange(txRow, txColProcessed + 1)
      .setValue(true);
}

function hashString(password) {
  // 4) hash the submitted password (SHA‑256 → hex)
  const hashBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return hashBytes
    .map(b => {
      const v = (b < 0 ? b + 256 : b).toString(16);
      return v.length === 1 ? '0' + v : v;
    })
    .join('');
}

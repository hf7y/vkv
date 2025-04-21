/**
 * emailSender.gs – Formats and sends access emails, and logs events.
 */

// const LOG_SHEET_NAME = 'Logs';

/**
 * sendAccessEmail(email, site)
 * Generates a token, stores it, emails the magic‑link, and logs the event.
 *
 * @param {string} email – Recipient’s email address
 * @param {string} site  – Base URL for the web app (must include /exec)
 * @throws {Error} on failure (to bubble up to client)
 */
function sendAccessEmail(email, site) {
  try {
    // 1) Generate and store token
    const token = generateToken(email, site);
    storeToken(email, site, token);

    // 2) Build and send the email
    const link    = `${site}?token=${encodeURIComponent(token)}`;
    const subject = `Your Access Link for ${site}`;
    const body    = buildEmailBody(link);

    MailApp.sendEmail({
      to:      email,
      subject: subject,
      body:    body,
      name:    'Access Gateway'
    });

    const msg = `Email sent to ${email} with link: ${link}`;
    Logger.log('✅ ' + msg);
    logEvent('EmailSent', email, msg);

  } catch (err) {
    const errMsg = `Failed to send email to ${email}: ${err.message}`;
    Logger.log('❌ ' + errMsg);
    logEvent('EmailError', email, errMsg);
    throw err;  // so client sees the failure
  }
}

/**
 * buildEmailBody(link)
 * Returns the plain‑text email message with the magic link.
 *
 * @param {string} link – The full URL including token parameter
 * @return {string}
 */
function buildEmailBody(link) {
  return [
    'Hello,',
    '',
    'Here is your access link:',
    link,
    '',
    'This link is unique to your email and may expire.',
    'If you did not request this, you can ignore this message.',
    '',
    'Thanks,',
    'The TAG System'
  ].join('\n');
}

/**
 * logEvent(type, email, message)
 * Appends a timestamped log entry to the Logs sheet.
 *
 * @param {string} type    – e.g. 'EmailSent', 'EmailError'
 * @param {string} email   – User’s email address
 * @param {string} message – Descriptive message
 */
function logEvent(type, email, message) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let sheet   = ss.getSheetByName(LOG_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Type', 'Email Address', 'Message']);
  }

  sheet.appendRow([new Date(), type, email, message]);
}

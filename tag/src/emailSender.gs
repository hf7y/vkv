/**
 * Sends an access email with a tokenized magic link
 * @param {string} email - Recipient's email address
 * @param {string} site - Base URL for the target site (e.g. https://example.com)
 */
function sendAccessEmail(email, site) {
  try {
    const token = generateToken(email, site);
    storeToken(email, site, token);

    const link = `${site}?token=${encodeURIComponent(token)}`;
    const subject = `Your Access Link for ${site}`;
    const body = buildEmailBody(link);

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      name: "Access Gateway"
    });

    const message = `Email sent to ${email} with link: ${link}`;
    Logger.log(`✅ ${message}`);
    logEvent("EmailSent", email, message);

  } catch (error) {
    const message = `❌ Failed to send email to ${email}: ${error}`;
    Logger.log(message);
    logEvent("EmailError", email, message);
    throw error; // rethrow for frontend failure handler
  }
}

/**
 * Constructs the email message body
 * @param {string} link - Full access URL with token
 * @return {string} - Email message body
 */
function buildEmailBody(link) {
  return (
    `Hello,\n\n` +
    `Here is your access link:\n\n` +
    `${link}\n\n` +
    `This link is unique to your email and may expire.\n` +
    `If you did not request this, you can ignore this message.\n\n` +
    `Thanks,\n` +
    `The TAG System`
  );
}

/**
 * Logs an event to the Logs sheet (auto-creates if needed)
 * @param {string} type - Event type (e.g. EmailSent, EmailError)
 * @param {string} email - User email
 * @param {string} message - Description
 */
function logEvent(type, email, message) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("Logs");

  if (!sheet) {
    sheet = ss.insertSheet("Logs");
    sheet.appendRow(["Timestamp", "Type", "Email Address", "Message"]);
  }

  sheet.appendRow([new Date(), type, email, message]);
}

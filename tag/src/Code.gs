/**
 * Code.gs – Main entry point for TAG
 * Handles token-based routing and optional email dispatch
 */

/**
 * Handle GET requests to the web app (e.g. ?token=abc123)
 */

/**
 * Helper: HTML templating include
 * Usage: <?!= include("filename") ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * doGet handler for the TAG gateway
 * - If ?token is present and valid → success.html
 * - If ?token is present but invalid → denied.html
 * - If no token → serve gateway.html (interactive email request scene)
 */
function doGet(e) {
  const token = e.parameter.token;

  if (token) {
    const match = lookupToken(token);
    if (match) {
      return HtmlService.createHtmlOutputFromFile("success");
    } else {
      return HtmlService.createHtmlOutputFromFile("denied");
    }
  } else {
    return HtmlService.createTemplateFromFile("gateway").evaluate();
  }
}

/**
 * Manually trigger sending an access email with tokenized link.
 * Call this from the script editor or bind it to a button.
 */
function sendAccessEmail(email, targetSite) {
  const token = generateToken(email, targetSite);
  storeToken(email, targetSite, token);

  const accessLink = `${targetSite}?token=${token}`;
  const subject = `Your Access Link for ${targetSite}`;
  const body = `Hello,\n\nHere is your access link:\n\n${accessLink}\n\nThis link is unique to your email and may expire.\n\n– The TAG System`;

  MailApp.sendEmail(email, subject, body);
}

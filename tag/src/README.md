# `src/` Folder

This directory contains all of the server‑side Google Apps Script code for the Tokenized Access Gateway (TAG). It is responsible for routing, token generation/lookup, email dispatch, and integration with the shared Google Sheet.

---

## Files

### 1. `Code.gs`

**Responsibilities:**

- \`\`: Entry point for the Web App.

  - `?format=json&token=XYZ` → returns JSON `{valid, record}`
  - `?token=XYZ`          → serves `success.html` or `denied.html`
  - no parameters         → serves `gateway.html`

- \`\`

  - Generates a token via `generateToken`
  - Stores it with `storeToken`
  - Emails the magic link to the user

- \`\`

  - Checks for token existence in the sheet
  - Returns `true` or throws an error

- \`\`

  - Retrieves the email associated with a valid token via `lookupToken`

- **Internal helper**: `lookupToken(token)` (inlined or delegated) to fetch full row metadata.

### 2. `tokenUtils.gs`

**Responsibilities:**

- \`\`

  - Creates a unique token (UUID)

- \`\`

  - Appends `[email, site, token, timestamp]` to the Sheet

- \`\`

  - Scans all rows for a matching token, returns `{email, site, token, timestamp}` or `null`

- \`\`

  - Logs the raw lookup result for troubleshooting

### 3. `emailSender.gs`

**Responsibilities:**

- \`\` (wrapper)

  - Generates & stores the token
  - Builds the email body via `buildEmailBody`
  - Sends the email with `MailApp.sendEmail`
  - Logs success or failure to `Logs` sheet via `logEvent`

- \`\`

  - Renders the plain‑text email content with the magic link

- \`\`

  - Appends event records to a `Logs` sheet, auto‑creating it if missing

---

## Configuration

- **Spreadsheet settings** (ID, sheet name, column indices) live in `sheetConfig.gs` (outside of `src/`).
- Update `SHEET_ID` and `SHEET_NAME` constants before deploying.

---

## Deployment

1. **Authorize** the script for `MailApp`, `Spreadsheets` and `UrlFetchApp` scopes.
2. **Deploy** as a Web App (`executeAs: USER_DEPLOYING`, `access: ANYONE_ANONYMOUS`).
3. Copy the `/exec` URL into your client projects and `sheetConfig.gs` if needed.
4. Test JSON health‑check:
   ```js
   UrlFetchApp.fetch(`${YOUR_EXEC_URL}?token=XYZ&format=json`)
   ```

Once deployed, the TAG service will handle all token creation, storage, email delivery, and validation for your downstream apps.


# Wavebucks `src/` Directory

This folder contains all server‑side Google Apps Script files powering the Wavebucks Web App.

---

## 📂 Files

### 1. `Code.gs`
- **`doGet(e)`**:
  - Routes requests based on the presence of `?token`:
    - **No token** → serves `index.html` (login form), injecting `waveAppUrl`.
    - **Valid token** → serves `app.html` (balance viewer), injecting `token`.
    - **Invalid token** → serves `bad-token.html` (access denied).
- **`getUserBalanceByEmail(email)`**: Looks up and returns a user’s balance from the **Balances** sheet.
- **`getUserBalanceByToken(token)`**: Delegates to the TAG library to map `token`→`email`, then calls `getUserBalanceByEmail`.
- **`validateTagToken(token)`** and **`getEmailFromToken(token)`**: Proxy calls to the TAG library (`TAG.validateTagToken`, `TAG.getEmailFromToken`).
- **`include(filename)`**: HTML templating helper (`<?!= include('...') ?>`).

### 2. `FormSubmit.gs`
- **`onFormSubmit(e)`**: Triggered by new rows in the **Transactions** sheet:
  1. Extracts `Timestamp`, `Action`, `Amount`, `Password`, `Email Address`.
  2. Hashes the password via `hashString()`.
  3. Finds or creates the user’s row in **Balances**, updates their balance and metadata.
  4. Overwrites the Transactions row to replace plain‑text password with its hash, write the previous balance, and mark it processed.
- **`hashString(password)`**: Computes SHA‑256 hex digest of the password.

### 3. `Login.gs`
- **`sendLoginLink(email)`**: Invoked from the client (via `google.script.run`) to send a magic‑link email:
  - Uses `TAG.sendAccessEmail(email, appUrl)`, where `appUrl = ScriptApp.getService().getUrl()`.
  - Offloads email formatting, token generation, storage, and delivery to the TAG library.

### 4. `sheetConfig.gs`
- **Constants**:
  - `SHEET_ID` – your Google Spreadsheet ID.
  - `BALANCES_SHEET` – name of the **Balances** tab.
  - `TRANSACTIONS_SHEET` – name of the **Transactions** tab.
  - `LOG_SHEET` – name of the **Logs** tab.
- **Column index constants** for the Balances sheet.
- **Helpers**:
  - `getWorkbook()` – returns the `Spreadsheet` object.
  - `getSheet(name)` – returns a named `Sheet` for consistent access.

---

## ⚙️ Setup
1. **Add TAG as a Library**
   - In **Project Settings → Libraries**, include your TAG Web App library with identifier `TAG`.
2. **Deploy Wavebucks Web App**
   - `Execute as: Me`
   - `Who has access: Anyone, even anonymous`
3. **Configure `sheetConfig.gs`**
   - Paste in your actual `SHEET_ID`.
   - Ensure sheet names match exactly.

---

## 🧪 Testing
- **WavebucksTest.gs** provides unit & integration tests.
- Run **`runAllWavebucksTests()`** to verify core behaviors:
  - Balance lookups
  - Token validation via TAG
  - `doGet` routing logic

---

## 🚀 Deployment
- Use **clasp** or the Apps Script editor’s **Deploy > Manage deployments**.
- Commit these `src/` files to your GitHub repo alongside your `html/` folder.

Happy coding! 🎉


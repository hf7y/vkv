# Wavebucks Balance Viewer

A Google Apps Script project that displays user balances in a fun, isometric pixel‑art style, gated by magic‑link authentication provided by the **Tokenized Access Gateway (TAG)**.

---

## 🚀 Quick Start

1. **Configure Spreadsheets**
   - Share your **Balances** sheet (ID in `src/sheetConfig.gs`).
   - Ensure `Transactions` and `Balances` tabs exist with the correct headers.

2. **Link the TAG Library**
   - In **Resources → Libraries…**, add your TAG project’s Script ID.
   - Select a stable version (not HEAD) and assign the identifier `TAG`.

3. **Deploy as Web App**
   - **Execute as:** `Me` (the deploying user)
   - **Who has access:** `Anyone, even anonymous`
   - Note the **Current web app URL** (your Wavebucks exec URL).

4. **Trigger Tests** (optional but recommended)
   - In the Apps Script editor, open **WavebucksTest.gs** and run `runAllWavebucksTests()`.

5. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Publish Wavebucks Balance Viewer"
   git push
   ```

---

## 📂 Project Structure

```text
Wavebucks/
├── src/
│   ├── Code.gs             # doGet, balance lookup, TAG integration
│   ├── Login.gs            # (legacy) login & signup handlers
│   ├── FormSubmit.gs       # transaction processing trigger
│   ├── sheetConfig.gs      # spreadsheet IDs & tab names
│   └── WavebucksTest.gs    # unit & integration tests
├── html/
│   ├── index.html          # email‑entry login form
│   ├── app.html            # balance viewer template
│   ├── BalanceLoader.html  # client‑side token validation logic
│   ├── BalanceRenderer.html# graphics rendering logic
│   └── Styles.html         # shared CSS (Game Boy / isometric grid)
└── assets/…                # (optional) pixel‑art sprites & borders
```  

---

## 🔑 Authentication Flow

1. **Login (index.html)**
   - User enters email and clicks **Request Link**.
   - Client calls `TAG.sendAccessEmail(email, WAVE_APP_URL)`.
   - TAG emails a magic link: `https://…/exec?token=XYZ`.

2. **Magic‑Link Entry**
   - Clicking the link hits `src/Code.gs#doGet(e)` with `e.parameter.token`.
   - `validateTagToken(token)` delegates to TAG via library:
     ```js
     TAG.validateTagToken(token);
     ```
   - On success → renders `app.html` with `tpl.token = token`; on failure → `bad-token.html`.

3. **Balance Loading**
   - **BalanceLoader.html**: two‑step flow:
     ```js
     validateTagToken(token)
       → getUserBalanceByToken(token)
       → renderBalance(balance)
     ```
   - `getUserBalanceByToken` uses `TAG.getEmailFromToken(token)` then `getUserBalanceByEmail(email)`.

4. **Rendering (BalanceRenderer.html)**
   - Formats the balance and decomposes into coins/bars.
   - Renders an isometric grid of pixel‑art icons.

---

## 💾 Data Processing

- **FormSubmit.gs** handles Google Form submissions:
  - Hashes passwords (`SHA‑256`), updates `Balances`, marks transactions.
  - **Unaffected** by TAG once the user reaches the app.

- **sheetConfig.gs** holds:
  ```js
  const SHEET_ID   = '…';
  const SHEET_NAME = 'Balances';
  ```

---

## 🧪 Testing

- **WavebucksTest.gs** runs:
  - `testGetUserBalanceByEmail()`
  - `testValidateTagToken()`
  - `testGetUserBalanceByToken()`
  - `testDoGetRouting()`

Invoke `runAllWavebucksTests()` to verify core behaviors before deployment.

---

## 🔧 Customization & Deployment

- **Styles.html**: tweak colors, sizes, or swap in your own pixel‑art palette.
- **BalanceRenderer**: adjust `scale`, `isoXStep`, `layerStep` for different resolutions.
- **Assets**: drop in sprites under `assets/` and update URLs in HTML/CSS.

When you’re ready:
1. Commit & push to GitHub.  
2. Create a new Web App deployment.  
3. Share the **exec URL** with your users.

Enjoy your pixel‑perfect balance viewer!  🚀


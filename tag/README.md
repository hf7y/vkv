# Tokenized Access Gateway (TAG)

A **serverless** Google Apps Script service that issues, stores, and validates magic‑link tokens to gate access to arbitrary web apps (like Wavebucks). TAG emails users a secure link containing a one‑time token; downstream apps then call back to TAG to verify the token before granting access.

---

## 🗂️ Project Structure

```
/                       ← root
├─ README.md            ← this file
├─ sheetConfig.gs       ← global spreadsheet/config constants
├─ src/                 ← server‑side GAS code
│   ├─ Code.gs          ← router, JSON & HTML endpoints
│   ├─ tokenUtils.gs    ← token gen, store, lookup helpers
│   └─ emailSender.gs   ← email building, sending, logging
├─ html/                ← HTML & JS fragments for gateway UI
│   ├─ gateway.html     ← entry form (no token)
│   ├─ visual.html      ← CSS for chalkboard & sprites
│   ├─ accessForm.html  ← client JS to request magic link
│   ├─ success.html     ← access granted view
│   └─ denied.html      ← access denied view
├─ assets/              ← static images (sprites, borders)
└─ Test.gs              ← stress tests for token workflows
```

See **src/README.md** and **html/README.md** for detailed file descriptions.

---

## 🚀 Quickstart

1. **Configure**
   - Set your **sheetConfig.gs** constants:
     ```js
     const SHEET_ID   = 'YOUR_SHEET_ID';
     const SHEET_NAME = 'Tokens';
     ```
2. **Deploy** TAG as a Web App:
   - **Execute as:** Me (USER_DEPLOYING)
   - **Access:** Anyone, even anonymous
   - Copy the generated **/exec** URL.
3. **Integrate** in your client app:
   - Call `sendAccessEmail(email, TAG_EXEC_URL)` to issue tokens.
   - On token link clicks (`?token=XYZ`), your app calls TAG’s `/exec?format=json&token=XYZ` to validate.

---

## 🔄 Workflow Overview

1. **User requests access** via a form (`gateway.html`).
2. TAG generates `UUID` token, stores it (`Tokens` sheet), emails link: `https://TAG_URL/exec?token=XYZ`.  
3. **Downstream app** (e.g., Wavebucks) receives user at `?token=XYZ`:
   - Calls TAG’s JSON endpoint → `{ valid:true, record }`.
   - On success, proceeds to protected UI; on failure, shows error.

---

## 🔧 Development & Testing

- **Local editing:** Use the Apps Script editor or clasp.
- **Unit tests:** `Test.gs` contains functions to simulate token issuance, validation, and edge cases.
- **Debug logs:** Use `Logger.log()` in server stubs, and `console.log()` in client fragments.

---

## 📚 Resources

- [Apps Script Web App Guide](https://developers.google.com/apps-script/guides/web)
- [MailApp.sendEmail](https://developers.google.com/apps-script/reference/mail/mail-app)
- [ContentService.createTextOutput](https://developers.google.com/apps-script/reference/content/content-service#createTextOutput(String))

---

*Crafted with 🛡️ and 🎨 by the TAG Team.*


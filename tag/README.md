# Tokenized Access Gateway (TAG)

A **serverless** Google Apps Script service that issues, stores, and validates magic‑link tokens to gate access to arbitrary web apps (like Wavebucks). TAG emails users a secure link containing a one‑time token; downstream apps then call back to TAG to verify the token before granting access.

---

## 🗂️ Project Structure

```
tag/                        ← this folder (self-contained Apps Script project)
├─ README.md                ← this file
├─ src/                     ← server‑side GAS code (what actually gets deployed)
│   ├─ Code.gs               ← router: doGet(e), sendAccessEmail, validateTagToken
│   ├─ tokenUtils.gs         ← token gen, store, lookup helpers
│   ├─ emailSender.gs        ← email building, sending, event logging
│   ├─ sheetConfig.gs        ← spreadsheet ID / sheet names / gatewayURL constant
│   ├─ appsscript.json       ← Apps Script manifest (scopes, webapp config)
│   ├─ Test.gs               ← in‑editor stress tests for token workflows
│   └─ README.md             ← detailed per‑file description of src/
├─ html/                    ← HTML & JS fragments served by the web app
│   ├─ gateway.html          ← entry form (no token)
│   ├─ visual.html           ← CSS for chalkboard & sprites
│   ├─ accessForm.html       ← client JS to request magic link
│   ├─ success.html          ← access granted view
│   ├─ denied.html           ← access denied view
│   └─ README.md             ← detailed per‑file description of html/
├─ assets/                  ← static images (sprites, chalkboard border)
│   └─ README.md
├─ docs/                    ← planning notes / ASCII architecture diagrams
│   └─ README.md             ← index of what's in docs/
├─ tag                       ← Sublime Text project file (editor state, not part of the app)
└─ tag.sublime-workspace      ← Sublime Text workspace state (editor state, not part of the app)
```

See **src/README.md** and **html/README.md** for detailed file descriptions, and
**docs/README.md** for an index of the design notes/diagrams.

---

## 🚀 Quickstart

1. **Create the backing Google Sheet** with at least a `Tokens` tab
   (columns: `Email | Site | Token | Timestamp`). A `Logs` tab is
   auto‑created on first send by `emailSender.gs`'s `logEvent()`.
2. **Configure** `src/sheetConfig.gs`:
   ```js
   const SHEET_ID       = 'YOUR_SPREADSHEET_ID';
   const SHEET_NAME     = 'Tokens';
   const LOG_SHEET_NAME = 'Logs';
   const gatewayURL     = 'https://script.google.com/macros/s/…/exec'; // fill in AFTER first deploy, see below
   ```
3. **Deploy** TAG as a Web App (Apps Script editor → Deploy → New deployment):
   - **Execute as:** Me (`USER_DEPLOYING`, per `src/appsscript.json`)
   - **Access:** Anyone, even anonymous (`ANYONE_ANONYMOUS`)
   - Copy the generated **`/exec`** URL, paste it into `gatewayURL` in
     `sheetConfig.gs` (step 2), then redeploy so the gateway form links back
     to itself correctly.
4. **Integrate** in your client app:
   - Call `sendAccessEmail(email, TARGET_SITE_URL)` to issue tokens (this is
     what `accessForm.html` already does for TAG's own gateway form).
   - On token link clicks (`?token=XYZ`), your downstream app calls TAG's
     `/exec?format=json&token=XYZ` to validate.

There is no `.clasp.json` checked in, so this project isn't currently wired
up for `clasp push`/`clasp pull` — code is maintained by editing directly in
the Apps Script editor. If you want local editing with `clasp`, run
`clasp clone <scriptId>` (or `clasp create`) inside `tag/src/` and add your
own `.clasp.json` (it's git‑ignored‑worthy — don't commit script IDs you
don't want public).

---

## 🔄 Workflow Overview

1. **User requests access** via a form (`gateway.html`).
2. TAG generates a `UUID` token, stores it (`Tokens` sheet), and emails a
   link: `https://TAG_URL/exec?token=XYZ`.
3. **Downstream app** (e.g., Wavebucks) receives the user at `?token=XYZ`:
   - Calls TAG's JSON endpoint → `{ valid:true, record }`.
   - On success, proceeds to protected UI; on failure, shows an error.
4. Visiting TAG's **own** `/exec?token=XYZ` directly (rather than a
   downstream app doing the JSON check) instead renders `success.html` or
   `denied.html` — see **Known Issues** below, these two views currently
   contain placeholder text only.

---

## 🔧 Development & Testing

- **Local editing:** Use the Apps Script editor (no `clasp` config is
  currently checked in — see Quickstart).
- **Unit tests:** `src/Test.gs` contains `runAllTests()` plus individual
  test functions to simulate token issuance, validation, JSON/HTML routing,
  and edge cases. Run them from the Apps Script editor.
- **Debug logs:** Use `Logger.log()` in server code (`src/*.gs`), and
  `console.log()` in client fragments (`html/*.html`). Sent-email
  successes/failures are also recorded to the `Logs` sheet via `logEvent()`.

---

## ⚠️ Known Issues

These were found while documenting the project and are left as documented
issues rather than fixed outright, since fixing them safely needs a call
about intended behavior that isn't obvious from the code alone:

- **`html/success.html` and `html/denied.html` are placeholders.** Right
  now each file's entire content is just the literal text `success.html` /
  `denied.html` — they've never contained real markup (confirmed all the
  way back to the commit that introduced them). `html/README.md` describes
  what they're *meant* to contain (a `<?!= include('visual') ?>` style block
  plus a `guard_after.png` / `guard_before.png` sprite), but that isn't
  implemented. Note also that `Code.gs`'s `doGet(e)` serves these two files
  via `HtmlService.createHtmlOutputFromFile(page)`, **not**
  `createTemplateFromFile(...).evaluate()` (unlike `gateway.html`) — so even
  once real content is added, any `<?!= include(...) ?>` scriptlet in them
  will *not* be evaluated and will show up as literal text unless either the
  `doGet` call is switched to the templated API or the CSS is inlined
  directly instead of using `include()`.
- **Duplicate function definitions across files.** `Code.gs` defines its own
  `lookupToken()` (duplicating `tokenUtils.gs`) and its own
  `sendAccessEmail()` (duplicating `emailSender.gs`, with a *different*
  implementation — the `emailSender.gs` version additionally calls
  `buildEmailBody()` and `logEvent()`). Apps Script concatenates all `.gs`
  files into one global scope, so only one definition of each function is
  actually live; which one "wins" isn't pinned down by anything in this
  repo (there's no `.clasp.json` `filePushOrder`). Recommend deciding which
  copy is canonical and deleting the other before relying on `logEvent()`
  being called on every send.
- **Two previously-broken `gatewayURL`/`GATEWAY_URL` casing bugs were found
  and fixed** as part of this cleanup: `Code.gs`'s `doGet()` was assigning
  the template variable from an undefined `GATEWAY_URL` (only lowercase
  `gatewayURL` is declared, in `sheetConfig.gs`), and `accessForm.html`'s
  client-side JS made the same mistake referencing `GATEWAY_URL` instead of
  the actual in-page `const gatewayURL`. Both would have thrown
  `ReferenceError`s at runtime (page load and form submit, respectively).
  Both now consistently use `gatewayURL`.

---

## 📚 Resources

- [Apps Script Web App Guide](https://developers.google.com/apps-script/guides/web)
- [MailApp.sendEmail](https://developers.google.com/apps-script/reference/mail/mail-app)
- [ContentService.createTextOutput](https://developers.google.com/apps-script/reference/content/content-service#createTextOutput(String))
- [HtmlService: createHtmlOutputFromFile vs createTemplateFromFile](https://developers.google.com/apps-script/reference/html/html-service) — relevant to the Known Issues above.

---

*Crafted with 🛡️ and 🎨 by the TAG Team.*

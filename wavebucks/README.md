# Wavebucks Integration with Tokenized Access Gateway (TAG)

This README outlines how to integrate the Wavebucks balance viewer with the standalone TAG magic-link service. It details current behaviors for each file and the changes needed to leverage TAG’s token generation, storage, and validation.

---

## 1. app.html – Balance Viewer Template

**Current Role**
- Renders the main Wavebucks UI when `?token` is present.
- Inlines `Styles.html` and `Scripts.html`, which define and invoke `loadBalance(token)`.
- Injects the token into the client script:
  ```html
  <script>
    const token = <?= JSON.stringify(token || "") ?>;
    loadBalance(token);
  </script>
  ```

**Changes for TAG Integration**
1. **Token Validation Flow**
   - Update `loadBalance(token)` to first call a new server-side `validateTagToken(token)`:
     ```js
     function loadBalance(token) {
       google.script.run
         .withSuccessHandler(() => _fetchBalance(token))
         .withFailureHandler(err => showAccessDenied(err.message))
         .validateTagToken(token);
     }

     function _fetchBalance(token) {
       google.script.run
         .withSuccessHandler(balance => renderBalance(balance))
         .withFailureHandler(err => showAccessDenied(err.message))
         .getUserBalanceByToken(token);
     }
     ```
2. **Implement `validateTagToken(token)`** in `Code.gs`:
   ```js
   function validateTagToken(token) {
     const url = `${TAG_URL}?token=${encodeURIComponent(token)}`;
     const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
     if (resp.getResponseCode() !== 200) {
       throw new Error('Invalid or expired link.');
     }
     return true;
   }
   ```
3. **Error Handling & UX**
   - Add `showAccessDenied(msg)` to display an “Access Denied” message:
     ```js
     function showAccessDenied(msg) {
       document.body.innerHTML = `<pre style="color:red;">Access Denied:\n${msg}</pre>`;
     }
     ```
4. **Remove Local Token Logic**
   - Deprecate any direct sheet lookups in `getUserBalanceByToken` for tokens.

---

## 2. Code.gs – Server Routing & Helpers

**Current Responsibilities**
- **`doGet(e)`**: 
  - Serves `app.html` if `?token` is present.
  - Serves `index.html` otherwise.
- **`getUserBalance()` / `getUserBalanceByEmail(email)`**: fetch balance by email.
- **`getUserBalanceByToken(token)`**: scan local sheet for matching token.
- **`include(filename)`**: templating helper.
- **Utility functions**: `shareSheetPublicly()`, `debugToken()`, `migrateEmailToToken()`.

**Changes for TAG Integration**
1. **Token Validation → TAG API**
   - Remove local token sheet lookups.
   - Add:
     ```js
     const resp = UrlFetchApp.fetch(`${TAG_URL}?token=${token}`, { muteHttpExceptions: true });
     if (resp.getResponseCode() === 200) {
       // proceed
     } else {
       // serve denied view
     }
     ```
2. **Routing in `doGet(e)`**
   - Validate the token with TAG before serving `app.html`. On failure, serve `denied.html`.
3. **Login Flow Swap-Out**
   - Replace local email-link logic with calls to `sendAccessEmail(email, WAVE_APP_URL)`.
4. **Cleanup & Deprecation**
   - Remove `migrateEmailToToken()`, `shareSheetPublicly()`, `debugToken()`.

---

## 3. FormSubmit.gs – Transaction Processor

**Current Behavior**
- Triggered on form submits to the **Transactions** sheet.
- Extracts `Timestamp`, `Action`, `Amount`, `Password`, and `Email Address`.
- Hashes password, updates or appends to **Balances**, and marks transactions processed.

**TAG Impact**
- No changes needed. Transactions remain gated by the successful TAG login flow.

---

## 4. index.html – Login Form Template

**Current Role**
- Displays Wavebucks login form (`<h1>WaveBucks</h1>`) when no token is present.
- Inlines `Styles.html` and form-specific CSS.
- Calls `login()` in `Login_JS.html`.

**Changes for TAG Integration**
1. **Update `login()`** to call TAG:
   ```js
   function login() {
     const email = document.getElementById('email').value.trim();
     if (!email) return showError('Enter a valid email.');
     google.script.run
       .withSuccessHandler(() => showMessage('Check your inbox.'))
       .withFailureHandler(err => showError(err.message))
       .sendAccessEmail(email, 'https://TAG_WEB_APP_URL/exec');
   }
   ```
2. **Remove Boilerplate**
   - Ensure a single valid HTML structure.
3. **Client-Side Logging**
   - Optionally add `logEvent('FormSubmitted', email, 'WaveBucks login request')`.

---

## 5. Login_JS.html – Client-Side Login Logic

**Current Behavior**
- Encodes email as base64 and calls `sendLoginLink(hashedEmail)`.
- Toggles login/app views with `showApp()`.
- Calls `getUserBalanceByEmail(email)`.

**Changes for TAG Integration**
1. **Use `sendAccessEmail` instead of `sendLoginLink`**; remove base64.
2. **Simplify Success Handling**: just display confirmation.
3. **Remove `showApp()` and email-based balance fetching**.
4. **Implement `loadBalanceByToken(token)`** to fetch balance post-validation.

---

## 6. html/Scripts.html – Balance Visualization & Load Logic

**Current Role**
- Defines isometric rendering and `renderBalance(balance)`.
- Loads balance via `loadBalance(token)` calling `getUserBalanceByToken`.

**Changes for TAG Integration**
1. **Two-Step Load Flow** via `validateTagToken` (see section 1).
2. **Error Handling**: use `showAccessDenied()`.
3. **Remove Local Token Logic** in server code.

---

## 7. Styles.html – Shared CSS

**Current Role**
- Global body and grid styles, isometric background.
- `.icon { image-rendering: pixelated; }`.

**Changes for TAG Integration**
1. **Scope Styles** to `.balance-view` and `.login-view`.
2. **Add Chalkboard Border** for `.login-form`:
   ```css
   .login-form {
     border: 8px solid transparent;
     border-image: url('../assets/board/chalkboard_border.png') 8 fill stretch;
     background-color: #2f3e33;
   }
   ```
3. **Maintain Pixelated Rendering**.

---

## Next Steps

1. Deploy TAG-powered login as the gateway to `app.html`.
2. Implement `validateTagToken()` and update `loadBalance()` and `doGet()`.
3. Verify wavebucks balances load correctly and unauthorized access is denied.

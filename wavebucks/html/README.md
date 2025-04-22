# html/ Directory README

This directory contains the front‐end templates and fragments for the Tokenized Access Gateway (TAG) visual experience.

---

## Files

### `gateway.html`
**Purpose:** Main entry point when no `?token` is present.

- **Head**
  ```html
  <style><?!= include("visual") ?></style>
  ```
- **Body**
  - Roman bureaucracy scene: `.bureaucracy-office` → `.scene`
  - Chalkboard form:
    ```html
    <form id="email-form" class="chalkboard" novalidate>
      <input type="email" id="email-input" placeholder="your@email.com" required>
      <button type="submit">Request Token</button>
    </form>
    ```
  - Response placeholder: `<div id="response-message" class="response"></div>`
- **Footer Script**
  ```html
  <script><?!= include("accessForm") ?></script>
  ```

---

### `accessForm.html`
**Purpose:** Pure JavaScript logic for the gateway form (no `<script>` wrapper).

- Binds `submit` on `#email-form`, disables/enables button, and shows feedback messages.
- Calls server methods:
  ```js
  google.script.run
    .withSuccessHandler(...)  // updates UI on success
    .withFailureHandler(...)  // handles errors
    .sendAccessEmail(email, gatewayURL);
  ```
- Logs events via `google.script.run.logEvent('FormSubmitted', ...)` and `logEvent('EmailError', ...)`.

---

### `visual.html`
**Purpose:** CSS fragment for all views.

- **Chalkboard styling**:
  ```css
  .chalkboard {
    border: 8px solid transparent;
    border-image: url('../assets/board/chalkboard_border.png') 8 fill stretch;
    background-color: #2f3e33;
  }
  ```
- Layout classes:
  - `.scene`, `.bureaucrat`, `.speech-bubble`, `.response`
  - Pixelated, retro/GameBoy aesthetic.

---

### `success.html`
**Purpose:** View shown when a valid token is provided.

- Includes:
  ```html
  <style><?!= include("visual") ?></style>
  ```
- Displays centurion‐sprite granting access:
  ```html
  <img src="../assets/sprites/guard_after.png" alt="Access Granted">
  ```

---

### `denied.html`
**Purpose:** View shown when an invalid or expired token is provided.

- Includes:
  ```html
  <style><?!= include("visual") ?></style>
  ```
- Displays guard‐sprite denying access:
  ```html
  <img src="../assets/sprites/guard_before.png" alt="Access Denied">
  ```

---

## Usage & Deployment

1. **Include Fragments**: All HTML files use `<?!= include("...") ?>` to pull in CSS/JS from `visual.html` and `accessForm.html`.
2. **Sync to Apps Script**: Copy this `html/` folder into your GAS project via CLI or Clasp.
3. **Publish**: Deploy the TAG project as a Web App (`ANYONE_ANONYMOUS` access, `USER_DEPLOYING` execution).
4. **Verify**: Visiting the exec URL with no `token` shows the form; with a valid `?token=XYZ` shows `success.html`; otherwise `denied.html`.

---

> **Tip:** Keep these HTML templates minimal—move all logic into your `.gs` and fragments.


# html/ – User Views for Tokenized Access Gateway (TAG)

This folder contains all HTML templates and visual assets served through `HtmlService`. These templates render the user-facing parts of the TAG system, including success and failure pages, as well as the new animated gateway scene.

## Files

### `success.html`
Shown when a user visits with a valid `?token=...` parameter. Customize this page with:
- A welcome message
- Transition or redirect to actual resource
- Placeholder for "Centurion grants access" pixel art

### `denied.html`
Shown when a user visits with a missing or invalid token. Can include:
- A Roman guard blocking entry
- Message like "You must present proper documentation"
- Link or prompt to try again

---

## 🎨 New in v2: Roman Bureaucracy Scene

### `gateway.html`
The main landing page shown when no token is present. It acts as a Roman bureaucratic office:
- Shows a bureaucrat sprite (currently placeholder)
- Displays a dialog: *"I'll have the scribe run it to you later. Write your name on the chalk board."*
- Provides a chalkboard-style form to request a token via email

### `visual.html`
CSS stylesheet included in `gateway.html` via templating. Contains styles for:
- Pixel art scene
- Speech bubble
- Chalkboard input
- Bureaucrat layout and framing
- Placeholder animation zones (e.g., gates, centurions)

### `accessForm.html`
JavaScript logic included via templating:
- Handles email form submission using `google.script.run.sendAccessEmail(...)`
- Updates visual dialog and UI with confirmation messages
- Logs events and errors to console and optionally backend

---

## Usage in Apps Script

These templates are included using templating helpers:

```html
<style>
  <?!= include("visual") ?>
</style>
<script>
  <?!= include("accessForm") ?>
</script>

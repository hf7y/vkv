# html/ – User-Facing Views for Tokenized Access Gateway (TAG)

This folder contains the HTML templates shown to users based on the status of their access token. These files are served using `HtmlService.createHtmlOutputFromFile()` in `Code.gs`.

## Files

### `success.html`
This page is shown to users who visit a valid tokenized link.  
Customize it with:
- Welcome message
- Project branding
- Optional redirect to the actual destination site (via meta refresh or JS)

**Served when:**
- A matching token is found in the Google Sheet.

---

### `denied.html`
This page is shown to users who:
- Visit without a `?token=...` parameter
- Use an invalid or expired token

You may want to include:
- A gentle error message
- Contact instructions for access requests
- A “Request Access” button if you're integrating with a form

---

## How to Use in Apps Script

In `Code.gs`, these views are returned like so:

```javascript
return HtmlService.createHtmlOutputFromFile("success");
return HtmlService.createHtmlOutputFromFile("denied");

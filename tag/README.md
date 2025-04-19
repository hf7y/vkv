# Tokenized Access Gateway (TAG)

A Google Apps Script project that emails users a secure link containing a token. The token is stored in a shared Google Sheet and used to grant access to other GAS-based web apps.

## Components

- `src/Code.gs`: Main router and URL entry point
- `src/tokenUtils.gs`: Token creation and lookup
- `src/sheetConfig.gs`: Spreadsheet config
- `src/emailSender.gs`: Email generation
- `html/`: Pages shown to users based on token status
- `Test.gs`: Stress test and validation suite

## Workflow

1. Run `sendAccessEmail(email, targetSite)` manually or via trigger.
2. User receives magic link: `https://example.com?token=XYZ`
3. Web app checks token in Google Sheet and shows appropriate view.

---

## ✨ Gamified Frontend Concept

A visual and interactive access gateway experience.

### Goals:
- Let users enter their email into a web form
- Email them a tokenized magic link
- Show fun animations or pixel art graphics for:
  - Access **Granted** (gateway opens)
  - Access **Denied** (gateway slams shut)

### Includes:
- A new HTML view (`gateway.html`) with a form and interactive animation
- Modified `doGet()` in `Code.gs` to show:
  - The form by default (no token)
  - Success or denied view if `?token=...` is present
- Potential integration with Canvas, CSS animations, or pixel art assets

---

## Manual Sync

```bash
# push to GitHub
git add .
git commit -m "Update token system"
git push

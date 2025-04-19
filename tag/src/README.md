# src/ – Tokenized Access Gateway (TAG) Core Scripts

This folder contains the core Google Apps Script (`.gs`) source files for the TAG system. These are intended to be copy-pasted into the Google Apps Script editor (one file per tab).

## Files

### `Code.gs`
Main entry point. Handles web requests and routing.
- `doGet(e)`: Reads token from URL, validates it, and returns appropriate HTML view
- `sendAccessEmail()` can be triggered manually or via UI

### `tokenUtils.gs`
Utility functions for managing access tokens.
- `generateToken(email, site)`: Creates a unique token (UUID)
- `lookupToken(token)`: Checks spreadsheet for matching token
- `storeToken(email, site, token)`: Appends token record to the spreadsheet

### `sheetConfig.gs`
Configuration for the token registry spreadsheet.
- Constants for spreadsheet ID and column indices
- Makes it easy to change sheet structure without touching logic

### `emailSender.gs`
Responsible for formatting and sending access emails.
- `sendAccessEmail(email, site)`: Sends a "magic link" email with tokenized URL
- Uses plain text or HTML templates (can be extended later)

## Notes

- These files assume the existence of a shared Google Sheet named "Tokens" with the following columns:
  - `Email Address`, `Site`, `Token`, `Timestamp`
- Tokens are passed in URL parameters like `?token=XYZ` and validated server-side
- HTML views for success/denied responses live in the `html/` folder

## Copy/Paste Setup

When pasting into Google Apps Script:
1. Create a new file for each `.gs` script
2. Paste each file’s contents into the corresponding Apps Script tab
3. Paste HTML files separately into the script editor’s HTML file type

---

For more details on the full system, see the root project [README](../README.md).

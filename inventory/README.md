# VKV Inventory Web App

A Google Apps Script–based web application for browsing and updating your club’s AV gear inventory stored in a Google Spreadsheet. The app features an isometric map interface, item detail views, photo links, and prefilled Google Forms for easy updates.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup & Deployment](#setup--deployment)
4. [Usage](#usage)
   - [Browsing Inventory](#browsing-inventory)
   - [Updating Inventory](#updating-inventory)
5. [Testing](#testing)
6. [Contributing](#contributing)
7. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
├── README.md           ← This file
├── html/               ← Front‑end assets
│   ├── index.html      ← App shell: loads UI fragments
│   ├── map.html        ← Isometric map of storage zones
│   ├── style.html      ← Mobile‑first CSS
│   └── app.html        ← Client‑side JavaScript
└── src/                ← Server‑side Apps Script code
    ├── Code.gs         ← Web App entrypoint + data API
    ├── Form_Submit.gs  ← Handles form submission updates
    ├── Form_URLs.gs    ← Generates prefilled Google Form URLs
    └── Test.gs         ← Automated tests for server logic
    └── TestHtml.gs     ← Smoke tests for HTML includes & doGet
```  

## Prerequisites

- **Google Sheet** named **Live VKV Inventory** with three sheets:
  1. **Form Responses**
  2. **Inventory**
  3. **Data Validation**
- **Google Form** with a question titled **ID** and the Form ID set in `src/Form_URLs.gs`.
- Editor access to the Sheet and Form for the Apps Script project.

---

## Setup & Deployment

1. Open the Apps Script project (via the Google Sheet’s **Extensions → Apps Script**).
2. Ensure `html/` folder and `src/` scripts are in place.
3. Deploy as a Web App:
   - **Deploy → New deployment → Web app**
   - **Execute as**: Me
   - **Who has access**: Anyone with the link (or customize)
4. Install the **On form submit** trigger:
   - In Apps Script: **Triggers → Add Trigger**
   - Select `onFormSubmit` from **Form_Submit.gs**
   - Event type: **On form submit**

---

## Usage

### Browsing Inventory

- Visit the deployed web app URL.
- The isometric map displays storage zones. Click on any zone icon to load its items.
- The detail card shows metadata, breadcrumbs, photos, and latest activity.
- Child items (if any) appear in a contents list with update links.

### Updating Inventory

- Click the “📤” button on any item or child item to open a prefilled Google Form for updates.
- Submit the form to record **Action**, **Record Quality**, **Photo**, **Comments**, and **Email Address**.
- The `onFormSubmit` trigger writes updates back to the **Inventory** sheet with timestamps.

---

## Testing

- **Server Tests**: In the Apps Script editor, open `src/Test.gs` and run `runAllTests()`. Verify PASS in **View → Logs**.
- **HTML Smoke Tests**: Run `runHtmlTests()` from `src/TestHtml.gs` to validate includes and `doGet()` output.

---

## Contributing

1. Fork or clone the project (using `clasp` or the Apps Script UI).
2. Add or modify scripts in `src/` or `html/`.
3. Write tests in `Test.gs` or `TestHtml.gs` as needed.
4. Deploy the web app and verify functionality.

---

## Troubleshooting

- **"Inventory sheet not found"**: Confirm the sheet name matches **Live VKV Inventory** and that permissions are granted.
- **Form link errors**: Verify the Form ID in `Form_URLs.gs` and that the form has the correct **ID** question.
- **Stale data**: Clear the cache key `ALL_INVENTORY` via `CacheService` if inventory changes aren’t reflected.
- **Client errors**: Use browser console to debug `selectZone` and `showObject` calls.

---

*Happy organizing!*


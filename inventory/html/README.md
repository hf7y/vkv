# src/ Directory — Server‑Side Scripts

This folder contains the Google Apps Script files that power the backend of the VKV Inventory web app: serving the UI, querying the spreadsheet, handling form submissions, and generating prefilled form URLs.

---

## Prerequisites

- **Spreadsheet**: A Google Sheet named **Live VKV Inventory** with three sheets:
  1. **Form Responses** (`Timestamp`, `ID`, `Action`, `Record Quality`, `Photo`, `Comments`, `Email Address`)
  2. **Inventory** (`ID`, `Label`, `Description`, `Container Style`, `ParentID`, `Category`, `Prefilled URL`, `Record Quality`, `Action`, `Photo`, `Comments`, `Timestamp`, `Email Address`)
  3. **Data Validation** (lists for `Container Style` and `Category`)

- **Google Form**: Form ID set in `Form_URLs.gs` must exist and include a question titled **ID**.
- **Permissions**: The Apps Script project must have editor access to the spreadsheet and the form.

---

## Deployment & Triggers

- **Web App**: Deployed via **Deploy → New deployment → Web app** in the Apps Script editor.  
  - *Execute as*: Me  
  - *Who has access*: Anyone with link (or adjust as needed)

- **Triggers**:
  - **onFormSubmit**: Install an **On form submit** trigger pointing to `onFormSubmit` in `Form_Submit.gs`.
  - Other functions are invoked on-demand by client code (e.g. `getObjectPackage` via `google.script.run`).

---

## Script Reference

### Code.gs

- **doGet(e)**  
  Serves `index.html` as the web app. Passes `e.parameter.id` into the template as `initialId`.

- **include(filename)**  
  Reads any HTML fragment file (without `.html`) and returns its contents for templating.

- **queryObjects()**  
  Reads the entire **Inventory** sheet into an array of objects (each key is a header). Caches the JSON for 30 minutes via `CacheService`.

- **getObjectById(id)**  
  Finds a single inventory record by matching the `ID` field exactly. Returns the record object or `null`.

- **getChildObjects(parentId)**  
  Returns all records whose `ParentID` matches the given `parentId`.

- **getObjectPackage(id)**  
  Public API: returns `{ data, parentId, childObjects }` for the given `id`, bundling the main record and its children.


### Form_Submit.gs

- **onFormSubmit(e)**  
  Triggered by new form submissions: extracts `ID`, `Action`, `Record Quality`, `Photo`, `Comments`, and `Email Address` from `e.namedValues`; locates the matching row in **Inventory**; updates the corresponding columns and timestamps.


### Form_URLs.gs

- **getPrefilledFormUrl(itemId)**  
  Opens the configured Google Form, sets the **ID** question to `itemId`, and returns the prefilled-URL string.

- **updateInventoryFormURLs()**  
  Loops through all rows in **Inventory**; for each `ID`, calls `getPrefilledFormUrl` and writes the result into the **Prefilled URL** column.

---

## Testing

- A `Test.gs` file is provided with assertion functions to validate core behaviors:
  - `queryObjects()` returns a nonempty array.
  - `getObjectById()` and `getChildObjects()` return expected records.
  - `getObjectPackage()` bundles data correctly.
  - `onFormSubmit()` handles missing or invalid data without errors.
  - `getPrefilledFormUrl()` returns a valid Google Forms URL containing the ID.
  - `updateInventoryFormURLs()` populates the **Prefilled URL** column correctly.

Run tests by selecting `runAllTests()` in the Apps Script editor and checking **View → Logs** for PASS/FAIL messages.

---

## Contributing

1. **Clone/Copy**: Use `clasp` or edit directly in the Apps Script editor.  
2. **Branch**: Create a feature or bugfix branch.  
3. **Test**: Add or update tests in `Test.gs`.  
4. **Push & Deploy**: Merge to main, then deploy the web app again to update the production URL.

Please follow existing naming conventions and document new functions in JSDoc style.

---

## Troubleshooting

- **"Inventory sheet not found"**: Ensure the spreadsheet is named exactly **Live VKV Inventory**, and the script has edit permissions.  
- **Errors during form URL update**: Verify the Form ID in `Form_URLs.gs` and that the form has an **ID** question.  
- **Client errors (`showObject` undefined)**: Confirm `app.html` is included in `index.html` via the `include('app')` directive.  
- **Cache-related mismatches**: Clear the cache key `ALL_INVENTORY` in the Apps Script editor or via `CacheService` if data seems stale.

---

> _This README is intended to help new developers understand and maintain the server‑side scripts for VKV Inventory._


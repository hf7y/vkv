# VKV Inventory — Server‑Side Scripts

## 1. Overview
A brief description of what this folder contains and how it fits into the overall Inventory web‑app.

## 2. Prerequisites
- A Google account with edit access to the **Live VKV Inventory** spreadsheet  
- The Google Form (ID in `Form_URLs.gs`) must exist and have a question titled “ID”  
- Apps Script project deployed as a Web App with appropriate permissions

## 3. Spreadsheet Layout
### Sheets
1. **Form Responses**  
   - Captures raw form submissions:  
     `Timestamp | ID | Action | Record Quality | Photo | Comments | Email Address`
2. **Inventory**  
   - Master data for items plus metadata and prefilled‑form URLs:  
     `ID | Label | Description | Container Style | ParentID | Category | Prefilled URL | Record Quality | Action | Photo | Comments | Timestamp | Email Address`
3. **Data Validation**  
   - Lookup lists for `Container Style` and `Category`

## 4. Deployment & Triggers
- **Web App** (served via `doGet(e)` in `Code.gs`)  
- **Form Submit Trigger**  
  - Installable trigger `onFormSubmit(e)` in `Form_Submit.gs`  
- **Manual Utility**  
  - Run `updateInventoryFormURLs()` to regenerate form links  

## 5. Script Reference

### Code.gs
- `doGet(e)`  
  Serves `index.html` and passes `e.parameter.id` as `initialId`.  
- `include(filename)`  
  Inserts HTML fragments.  
- `queryObjects()`  
  Reads and caches the entire Inventory sheet as an array of `{ header: value }` objects.  
- `getObjectById(id)`  
  Finds a single record by `ID`.  
- `getChildObjects(parentId)`  
  Returns all records whose `ParentID` matches.  
- `getObjectPackage(id)`  
  Bundles `{ data, parentId, childObjects }` for a given ID.

### Form_Submit.gs
- `onFormSubmit(e)`  
  Triggered on form submission:  
  1. Extracts fields from `e.namedValues`  
  2. Finds matching row in **Inventory** by `ID`  
  3. Updates **Action**, **Record Quality**, **Photo**, **Comment**, **Timestamp**, and **Email Address**

### Form_URLs.gs
- `getPrefilledFormUrl(itemId)`  
  Generates a prefilled‑response URL for the form question “ID”.  
- `updateInventoryFormURLs()`  
  Loops through **Inventory**, calls `getPrefilledFormUrl()`, and writes each URL into the “Prefilled URL” column.

## 6. Testing
- Add a `Test.gs` in this folder.  
- Run via the Apps Script editor’s **Run → Test** commands to verify:  
  - `queryObjects()` returns the right structure  
  - `getObjectById()` and `getChildObjects()` find correct records  
  - `onFormSubmit()` correctly updates a mock or test sheet  
  - `updateInventoryFormURLs()` writes valid URLs

## 7. Contributing
- Code style and naming conventions  
- How to add new features or fix bugs

## 8. Troubleshooting
- Common errors (missing sheet, missing form question, permission issues)  
- How to enable and view Logs in Apps Script  

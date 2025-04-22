/**
 * Google Apps Script Web App entry point.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  // Pass any parameters (like an initial ID) if needed.
  template.initialId = e.parameter.id || null;
  return template.evaluate();
}

/**
 * Include helper to insert fragment content.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Reads the "Inventory" sheet and returns an array of objects.
 * Uses getDisplayValues() to capture exactly the visible text.
 * 
 * Reads the sheet once, then caches the full JSON for up to 30 minutes.
 */
function queryObjects() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'ALL_INVENTORY';
  const cached = cache.get(cacheKey);
  if (cached) {
    // We got a cached JSON string—parse and return it
    return JSON.parse(cached);
  }
  
  // Otherwise, read the sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory");
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const objects = rows.map(row => {
    let obj = {};
    headers.forEach((h,i) => obj[h] = row[i]);
    return obj;
  });
  
  // Store in cache for 30 minutes (max TTL is 6 hours = 21600 seconds)
  cache.put(cacheKey, JSON.stringify(objects), 30 * 60);
  
  return objects;
}
/**
 * Finds one object in the Inventory sheet by ID using an exact match.
 * @param {string} id The lookup ID.
 * @return {Object|null} The matching record or null if not found.
 */
function getObjectById(id) {
  const all = queryObjects();
  const lookupID = String(id).trim();
  for (var i = 0; i < all.length; i++) {
    let sheetID = String(all[i].ID).trim();
    Logger.log("Comparing sheet value '" + sheetID + "' (" + sheetID.length +
               ") with lookup value '" + lookupID + "' (" + lookupID.length + ")");
    if (sheetID === lookupID) {
      Logger.log("Match found: " + JSON.stringify(all[i]));
      return all[i];
    }
  }
  Logger.log("No match found for: '" + lookupID + "'");
  return null;
}

/**
 * Filters and returns all child objects where ParentID exactly matches the provided id.
 * @param {string} parentId The parent ID.
 * @return {Array} Array of matching child objects.
 */
function getChildObjects(parentId) {
  const all = queryObjects();
  const target = String(parentId).trim();
  return all.filter(obj => String(obj.ParentID).trim() === target);
}

/**
 * Public API: Returns an object containing:
 *   - data: the main record (found via getObjectById),
 *   - parentId: the ParentID from the record (if any),
 *   - childObjects: any objects whose ParentID equals the lookup id.
 * @param {string} id The ID to look up.
 * @return {Object} Object with keys { data, parentId, childObjects }.
 */
function getObjectPackage(id) {
  const data = getObjectById(id);
  const parentId = data ? data.ParentID : null;
  const childObjects = getChildObjects(id);
  return { data, parentId, childObjects };
}

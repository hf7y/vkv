/**
 * Generates a pre-filled Google Form URL for a given item ID.
 * @param {string} itemId - The inventory record identifier to prefill.
 * @return {string} The pre-filled URL.
 */
function getPrefilledFormUrl(itemId) {
  // Replace with your actual Google Form ID.
  var formId = '167LGf0OdO8SQYBm03jc6CYcQlX2x8vrBROTG3CFvNYY';
  var form = FormApp.openById(formId);
  
  // Create a new response.
  var formResponse = form.createResponse();
  
  // Loop over all items, find the one with title "ID", and set its response.
  var items = form.getItems();
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle() === "ID") { // Make sure this matches your form question exactly.
      var textItem = items[i].asTextItem();
      var itemResponse = textItem.createResponse(itemId);
      formResponse.withItemResponse(itemResponse);
      break;
    }
  }
  
  // Generate the pre-filled URL.
  return formResponse.toPrefilledUrl();
}

/**
 * Loops through the inventory records in the "Inventory" sheet,
 * generates a pre-filled Google Form URL for each record using its ID,
 * and writes the URL into a new column "Prefilled URL".
 */
function updateInventoryFormURLs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Inventory");
  if (!sheet) {
    throw new Error("Inventory sheet not found.");
  }
  
  // Get all data (including header row)
  var data = sheet.getDataRange().getValues();
  if (data.length === 0) {
    Logger.log("No data in Inventory sheet.");
    return;
  }
  
  // First row contains headers.
  var headers = data.shift();
  
  // Find the index for the "ID" column.
  var idIndex = headers.indexOf("ID");
  if (idIndex === -1) {
    throw new Error("ID column not found in Inventory sheet.");
  }
  
  // Find (or add) the "Prefilled URL" column.
  var urlIndex = headers.indexOf("Prefilled URL");
  if (urlIndex === -1) {
    // Add "Prefilled URL" as a new column header.
    urlIndex = headers.length;
    sheet.getRange(1, urlIndex + 1).setValue("Prefilled URL");
    headers.push("Prefilled URL");
  }
  
  // Loop through each inventory record (each row in data corresponds to a row in the sheet starting at row 2).
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var itemId = row[idIndex];
    
    // Generate prefilled URL for this item ID.
    var prefilledUrl = getPrefilledFormUrl(itemId);
    
    // Write the prefilled URL in the "Prefilled URL" column.
    // i + 2 because data[0] corresponds to sheet row 2 (after header row).
    sheet.getRange(i + 2, urlIndex + 1).setValue(prefilledUrl);
  }
  
  Logger.log("Inventory updated with prefilled form URLs.");
}
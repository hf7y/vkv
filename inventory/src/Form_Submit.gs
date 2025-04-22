/**
 * Triggered automatically when a form response is submitted.
 * @param {Object} e The event object containing form response data.
 */
function onFormSubmit(e) {
  if (!e || !e.namedValues) {
    Logger.log("onFormSubmit triggered without a valid event object.");
    return;
  }
  
  try {
    var formData = e.namedValues;
    var id = formData["ID"] ? formData["ID"][0] : "";
    var action = formData["Action"] ? formData["Action"][0] : "";
    var recordQuality = formData["Record Quality"] ? formData["Record Quality"][0] : "";
    var photo = formData["Photo"] ? formData["Photo"][0] : "";
    var comment = formData["Comment"] ? formData["Comment"][0] : "";
    
    // Get the respondent's email address
    var email = formData["Email Address"] ? formData["Email Address"][0] : "";
    
    // Use the current time as the timestamp for the update.
    var timestamp = new Date();
    
    // Open the Inventory sheet by name.
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var inventorySheet = ss.getSheetByName("Inventory");
    if (!inventorySheet) {
      throw new Error("Inventory sheet not found.");
    }
    
    // Get the data from the inventory sheet.
    var data = inventorySheet.getDataRange().getValues();
    var headers = data.shift();
    
    // Determine the index of the "ID" column.
    var idIndex = headers.indexOf("ID");
    if (idIndex === -1) {
      throw new Error("ID column not found in Inventory sheet.");
    }
    
    // Loop through the data to find the matching ID.
    var rowToUpdate = -1;
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][idIndex]).trim() === id.trim()) {
        rowToUpdate = i + 2; // +2 because data[0] corresponds to sheet row 2
        break;
      }
    }
    
    if (rowToUpdate === -1) {
      Logger.log("No matching inventory record for ID: " + id);
      return;
    }
    
    // Determine the column indices for the fields to update.
    var actionCol = headers.indexOf("Action") + 1;
    var recordQualityCol = headers.indexOf("Record Quality") + 1;
    var photoCol = headers.indexOf("Photo") + 1;
    var commentCol = headers.indexOf("Comment") + 1;
    var timestampCol = headers.indexOf("Timestamp") + 1;
    // Optional: if you have a column for Email, you can update it too.
    var emailCol = headers.indexOf("Email Address") + 1;
    
    // Update the corresponding cells.
    if (actionCol > 0) {
      inventorySheet.getRange(rowToUpdate, actionCol).setValue(action);
    }
    if (recordQualityCol > 0) {
      inventorySheet.getRange(rowToUpdate, recordQualityCol).setValue(recordQuality);
    }
    if (photoCol > 0) {
      inventorySheet.getRange(rowToUpdate, photoCol).setValue(photo);
    }
    if (commentCol > 0) {
      inventorySheet.getRange(rowToUpdate, commentCol).setValue(comment);
    }
    if (timestampCol > 0) {
      inventorySheet.getRange(rowToUpdate, timestampCol).setValue(timestamp);
    }
    if (emailCol > 0 && email) { // Update the Email Address column if exists.
      inventorySheet.getRange(rowToUpdate, emailCol).setValue(email);
    }
    
    Logger.log("Inventory updated for ID: " + id + " from email: " + email);
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.message);
  }
}

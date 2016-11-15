function onEdit(e){
  //  Logger.log(e);
  var rowIndex = e.range.getRowIndex();
  var columnIndex = e.range.getColumnIndex(); 
  var tryingToEditAggregateIdColumn = columnIndex === 1;
  if(tryingToEditAggregateIdColumn) {
    Logger.log("Attempt to edit aggregateId. Exiting.");
    return
  }
  
  var oldValue = null;
  if(typeof e.oldValue != "undefined") {
    oldValue = e.oldValue.toString();
  }
  var newValue = e.value;  
  Logger.log("Old value: " + oldValue + " New value: " + newValue);

  // No idea why this is needed, but when a cell is empty, the e.value passed to onEdit contains an object with "{oldValue=somethingorother". Whose bug is that?
  Logger.log("Type of e.value: " + typeof e.value);
  if(typeof e.value == "object") {
    Logger.log("New value was blank.");
    newValue = "";
  }

  // What sheet are we on? 
  // (The name of the sheet is used as the name of the aggregate being updated, e.g. "Plumber" or "Customer")
  var sheet = e.source;
  var sourceSheet = sheet.getActiveSheet();
  var sourceSheetName = sourceSheet.getName(); 
  Logger.log("sourceSheetName: " + sourceSheetName);
  
  // What property is being changed? 
  // (The column heading in the first row of the sheet is used as the property name, e.g. the "Lastname" in C1 on the "Plumber" sheet is the lastname of a plumber.)
  var propertyName = sourceSheet.getRange(1, columnIndex).getValue();
  Logger.log("propertyName: " + propertyName);
    
  // Determine if the change needs logging:
  var singleCellEdited =  e.range.getWidth() === 1 && e.range.getHeight() === 1;
  Logger.log("singleCellEdited: " + singleCellEdited);
  var propertyNameFoundInRow1 = propertyName !== "";
  Logger.log("propertyNameFoundInRow1: " + propertyNameFoundInRow1);
  var notEditingPropertyNameCell = rowIndex > 1;
  Logger.log("notEditingPropertyNameCell: " + notEditingPropertyNameCell);
  var notEditingAggregateIdCell = columnIndex > 1;
  Logger.log("notEditingAggregateIdCell: " + notEditingAggregateIdCell);
  var notTryingToEditEventLogSheet = sourceSheetName !== "Event Log";
  Logger.log(" notTryingToEditEventLogSheet: " + notTryingToEditEventLogSheet);
  
  if(singleCellEdited 
     && propertyNameFoundInRow1
     && notEditingPropertyNameCell
     && notEditingAggregateIdCell
     && notTryingToEditEventLogSheet) {
        Logger.log("Logging event ...");
        var aggregateType = sourceSheetName;
        Logger.log("aggregateType: " + aggregateType);    
        var aggregateIdCell = sourceSheet.getRange('A' + rowIndex);
        
        // Determine aggregateId and eventType:
        var aggregateId = aggregateIdCell.getValue();
        if(aggregateIdCell.getValue() === "") {
          aggregateId = Utilities.getUuid();
          aggregateIdCell.setValue(aggregateId);
          var eventType = aggregateType + "Created";        
        } else {
          var eventType = aggregateType + "Updated";
        } // endif
        Logger.log("eventType: " + eventType);
            
        // Log event:
        var eventId = Utilities.getUuid();
        var eventLog = sheet.getSheetByName("Event Log");
        eventLog.appendRow([new Date(), eventId, eventType, aggregateId, aggregateType, propertyName, oldValue, newValue]);      
        Logger.log(eventType + " event logged.");
  } //endif
}

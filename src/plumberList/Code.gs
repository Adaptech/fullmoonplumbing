function onEdit(e){
  Logger.log(e);
  var columnIndex = e.range.getColumnIndex(); 
  var tryingToEditAggregateIdColumn = columnIndex === 1;
  if(tryingToEditAggregateIdColumn) {
    Logger.log("Attempt to edit aggregateId. Exiting.");
    return
  }

  // Validate input:
  var oldValue = e.oldValue;
  if(typeof oldValue == "undefined") {
    oldValue = null;
  }
  var newValue = e.value;
  //TODO: Field validations.

  var sheet = e.source;
  var sourceSheet = sheet.getSheets()[0];
  var sourceSheetName = sourceSheet.getName(); 
  Logger.log("sourceSheetName: " + sourceSheetName);
  
  // Determine which property has changed:
  var propertyName = sourceSheet.getRange(1, columnIndex).getValue();
  Logger.log("propertyName: " + propertyName);
    
  // Determine if the change needs logging:
  var singleCellEdited =  e.range.getWidth() === 1 && e.range.getHeight() === 1;
  var propertyNameFoundInRow1 = propertyName !== "";
  var rowIndex = e.range.getRowIndex();
  var notEditingPropertyNameCell = rowIndex > 1;
  var notEditingAggregateIdCell = columnIndex > 1;
  var notTryingToEditEventLogSheet = sourceSheetName !== "Event Log";
  Logger.log("singleCellEdited: " + singleCellEdited + " propertyNameFoundInRow1: " + propertyNameFoundInRow1 + " notEditingPropertyNameCell: " + notEditingPropertyNameCell + " notTryingToEditEventLogSheet: " + notTryingToEditEventLogSheet);
  if(notTryingToEditEventLogSheet && singleCellEdited && propertyNameFoundInRow1  && notEditingPropertyNameCell) {
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
    }
    Logger.log("eventType: " + eventType);
    //TODO: How can we detect deletion events?
        
    // Log event:
    var eventId = Utilities.getUuid();
    var eventLog = sheet.getSheetByName("Event Log");
    eventLog.appendRow([new Date(), eventId, eventType, aggregateId, aggregateType, propertyName, oldValue, newValue]);      
    Logger.log(eventType + " event logged.");
  }
}


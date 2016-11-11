var esClient = require('eventstore-node');
var uuid = require('uuid');
var request = require("request");

var esConnection = esClient.createConnection({}, {"hostname": "localhost", "port": 1113});
esConnection.connect();
esConnection.once('connected', function (tcpEndPoint) {
    // console.log('Connected to eventstore at ' + tcpEndPoint.hostname + ":" + tcpEndPoint.port);

    // GET events from Google Sheet:
    var options = { method: 'GET',
      url: 'https://docs.google.com/spreadsheets/d/1DDpscPOD_ey9bAT6W7weGIPMiejOsKgY1s5v12oemaU/pub',
      qs: { gid: '1115265347', single: 'true', output: 'csv' },
      headers: 
      { 
        'cache-control': 'no-cache',
        'content-type': 'text/csv' },
      };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var csv = body.split("\r\n");
      var headers = csv[0].split(",");

      for (var i = 1; i < csv.length; i++) {
          var fields = csv[i].split(",");
          timestamp = fields[0];
          eventId = fields[1];
          eventType = fields[2];
          aggregateId = fields[3];
          aggregateType = fields[4];
          property = fields[5];
          oldValue = fields[6];
          newValue = fields[7];

          // Store events in Eventstore:
          var streamName = "legacy" + "-" + aggregateType + "-" + aggregateId;
          // console.log("Storing " + eventType + " event " + eventId + ". Look for it at: http://localhost:2113/web/index.html#/streams/" + streamName);          
          var eventData = {
              "eventType": eventType,
              "property": property,
              "oldValue": oldValue,
              "newValue": newValue
          };
          var metaData = {
              "changedAt" : timestamp
          };
          var event = esClient.createJsonEventData(eventId, eventData, metaData, eventType);

          esConnection.appendToStream(streamName, esClient.expectedVersion.any, event)
              .then(function(result) {
                  ;
              })
              .catch(function(err) {
                  // console.log(err);
              });
      } // endfor
    });
});


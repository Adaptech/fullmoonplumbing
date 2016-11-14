var utils = require('../utils');
var uuid = require('uuid');
var esClient = require('eventstore-node');

module.exports = function commandHandlerFactory (esConnection, logger) {
  return function commandHandler (aggregateId, aggregate, command, metadata, create) {
    console.log("AGGREGATEID");
    console.log(aggregateId);
    console.log("AGGREGATEID");
    console.log(aggregate);
    if (!create && typeof metadata === 'boolean') {
      create = metadata;
      metadata = null;
    }
    var start = Date.now();
    metadata = metadata || {};
    metadata.timestamp = start;
    var streamName = aggregate.constructor.name + '-' + aggregateId;

    return (create ? Promise.resolve([]) : esConnection.readStreamEventsForward(streamName, 0, 4096, true))
        .then(function (readResult) {
          readResult.events
            .map(ev => JSON.parse(ev.originalEvent.data.toString()))
            .forEach(aggregate.hydrate);
          return readResult.events.length;
        })
        .then(function (expectedVersion) {
            var events = aggregate.execute(command);
            var eventList = [];
            for(var i=0; i < events.length; i++) {
              //TODO: expectedVersion needs testing/code review.
              var evt = {
                event: esClient.createJsonEventData(uuid.v4(), events[i], metadata),
                expectedVersion: expectedVersion - 1
              };
              eventList.push(evt);
            };
          return eventList;
        })
        .then(function (data) {
          var eventList = [];
          var expectedVersion = null;
          for(var i=0; i < data.length; i++) {
            expectedVersion = data[i].expectedVersion;
            eventList.push(data[i].event);
          };
          return esConnection.appendToStream(streamName, expectedVersion, eventList);
        })
        .then(function (result) {
          logger.info('Processing command', utils.getTypeName(command), JSON.stringify(command), "create="+create, 'took', Date.now()-start, 'ms');
          return result;
        });
  };
};
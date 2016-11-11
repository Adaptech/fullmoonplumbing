var utils = require('../utils');
var uuid = require('uuid');
var esClient = require('eventstore-node');

module.exports = function commandHandlerFactory (esConnection, logger) {
  return function commandHandler (aggregateId, aggregate, command, metadata, create) {
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
          return {
            event: aggregate.execute(command),
            expectedVersion: expectedVersion - 1
          };
        })
        .then(function (data) {
          var event = esClient.createJsonEventData(uuid.v4(), data.event, metadata);
          return esConnection.appendToStream(streamName, data.expectedVersion, [event]);
        })
        .then(function (result) {
          logger.info('Processing command', utils.getTypeName(command), JSON.stringify(command), "create="+create, 'took', Date.now()-start, 'ms');
          return result;
        });
  };
};
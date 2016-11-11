var esClient = require('eventstore-node');

function filter(rows, constraints) {
  if (!constraints) {
    return rows;
  }
  var filters = Object.getOwnPropertyNames(constraints).map(function (field) {
    var value = constraints[field];
    if (Array.isArray(value)) {
      return function(x) {
        return value.indexOf(x[field]) >= 0;
      }
    }
    return function (x) {
      return x[field] === value;
    }
  });
  return filters.reduce(function (results, f) {
    return results.filter(f);
  }, rows);
}

function DependencyProvider(dependencies, values) {
  if (!Array.isArray(dependencies)) {
    throw new TypeError('Parameter dependencies must be an array.');
  }
  if (!Array.isArray(values)) {
    throw new TypeError('Parameter values must be an array.');
  }
  if (dependencies.length !== values.length) {
    throw new Error('Parameter dependencies and values must have same length.');
  }
  this.get = function (modelName, constraints) {
    var index = dependencies.indexOf(modelName);
    if (index < 0) {
      throw new Error('Dependency missing: ' + modelName);
    }
    return filter(values[index], constraints);
  };
}

function ReadRepository(esConnection, logger) {
  var models = {};
  var readStore = {};

  var dependencyProvider = {
    get: function (modelName, constraints) {
      return filter(readStore[modelName], constraints);
    }
  };

  function parseData(buf) {
    try {
      return JSON.parse(buf.toString());
    } catch(e) {
      return null;
    }
  }

  esConnection.subscribeToAllFrom(null, true,
    function (s, evData) {
      logger.info('Processing event', evData.originalEvent.eventType);
      // console.log(evData);
      try {
        var eventData = {
          typeId: evData.originalEvent.eventType,
          event: parseData(evData.originalEvent.data),
          metadata: parseData(evData.originalEvent.metadata)
        };
        for (var k in models) {
          readStore[k] = models[k].reducer.call(dependencyProvider, readStore[k], eventData);
        }
      } catch(e) {
        logger.error('Error processing event', e.stack);
      }
    },
    function () {
      logger.info('Live processing started.');
    },
    function (c, r, e) {
      logger.info('Subscription dropped.', c, r, e);
    },
    new esClient.UserCredentials('admin', 'changeit')
  );

  this.define = function (modelName, model) {
    if (!model) {
      throw new Error('model parameter is missing.');
    }
    // console.log(model);
    if (!model.reducer || !model.filters) {
      throw new TypeError('model MUST have reducer and filters properties.');
    }
    logger.info('Defining model:', modelName);
    models[modelName] = model;
    readStore[modelName] = [];
  };

  this.findOne = function (modelName, constraints, noThrowOnError) {
    return Promise.resolve(readStore[modelName])
        .then(rows => {
          return filter(rows, constraints);
        })
        .then(results => {
          return results[0];
        });
  };

  this.findAll = function (modelName) {
    return Promise.resolve(readStore[modelName]);
  };

  this.findWhere = function (modelName, constraints) {
    return Promise.resolve(readStore[modelName])
        .then(rows => {
          return filter(rows, constraints);
        });
  };
}

module.exports = ReadRepository;
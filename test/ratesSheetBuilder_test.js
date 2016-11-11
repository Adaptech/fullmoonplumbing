var PlumberCreated = require('../dist/events/PlumberCreated').default;
var RateChanged = require('../dist/events/RateChanged').default;
var Plumber = require('../dist/domain/Plumber').default;
var RatesSheetBuilder = require('../dist/readModels/RatesSheetBuilder');
var CreatePlumber = require('../dist/commands/CreatePlumber').default;

module.exports = {
  'Test PlumberCreated': function (test) {
    // Given previous events:
    var plumber = new Plumber();
    var previousEvents = plumber.execute(new CreatePlumber("134564","Mike", "Edmunds", 80.0, 100.0));

    // When sending previous events to the rates sheet builder read model:
    var result = [];
    for(i=0; i < previousEvents.length; i++) {
      var eventData = {
        typeId: previousEvents[i].constructor.name,
        event: previousEvents[i],
      };
      result = RatesSheetBuilder.reducer(result,eventData);
    }

    //Then:
    test.equal(result.length, 1)
    test.equal(result[0].plumberId, '134564');
    test.equal(result[0].name, 'Edmunds, Mike');
    test.equal(result[0].regularRate, 80.0);
    test.equal(result[0].overtimeRate, 100.0);
    test.equal(result[0].canBeScheduled, true);
    test.done();
  }      
};

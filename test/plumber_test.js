var Plumber = require('../dist/domain/Plumber').default;
var CreatePlumber = require('../dist/commands/CreatePlumber').default;
var PlumberCreated = require('../dist/events/PlumberCreated').default;
// Only if rate and overtime rate are not null:
var PlumberIsAvailable = require('../dist/events/PlumberIsAvailable').default;

module.exports = {
  'Test Create Plumber': function (test) {
    var plumber = new Plumber();
    var result = plumber.execute(new CreatePlumber("134564","Mike", "Edmunds", null, null));
    test.ok(result.length == 1)
    test.ok(result[0] instanceof PlumberCreated);
    test.equal(result[0].plumberId, "134564");
    test.equal(result[0].firstName, "Mike");
    test.equal(result[0].lastName, "Edmunds");
    test.done();
  },
  'Test Create Plumber available for scheduling immediately': function (test) {
    var plumber = new Plumber();
    var result = plumber.execute(new CreatePlumber("134564","Mike", "Edmunds", 80.0, 100.0));
    test.ok(result.length == 2)
    test.ok(result[0] instanceof PlumberCreated);
    test.equal(result[0].plumberId, "134564");
    test.equal(result[0].firstName, "Mike");
    test.equal(result[0].lastName, "Edmunds");

    test.ok(result[1] instanceof PlumberIsAvailable);
    test.equal(result[1].regularRate, 80.0);
    test.equal(result[1].overtimeRate, 100.0);
    
    test.done();
  },
  'Test Create Plumber with negative rate': function (test) {
    var plumber = new Plumber();
    var result = plumber.execute(new CreatePlumber("134564","Mike", "Edmunds", -5, 100.0));
    test.ok(result.length == 1)
    test.ok(result[0] instanceof PlumberCreated);
    test.done();
  },  
  'Test Create Plumber with negative overtime rate': function (test) {
    var plumber = new Plumber();
    var result = plumber.execute(new CreatePlumber("134564","Mike", "Edmunds", 50.00, -100.0));
    test.ok(result.length == 1)
    test.ok(result[0] instanceof PlumberCreated);
    test.done();
  },  
  'Test Create Plumber mandatory firstname': function (test) {
    var plumber = new Plumber();
    test.throws( function() { plumber.execute(new CreatePlumber("134564",null, "Smith", 80.0, 100.0)), PlumberRequiredFieldError } ); 
    test.done();
  },
  'Test Create Plumber mandatory lastName': function (test) {
    var plumber = new Plumber();
    test.throws( function() { plumber.execute(new CreatePlumber("134564","Joe", null, 80.0, 100.0)), PlumberRequiredFieldError } ); 
    test.done();
  },
  'Test Update Plumber mandatory firstname': function (test) {
    var plumber = new Plumber();
    test.throws( function() { plumber.execute(new UpdatePlumber("134564",null, "Smith", 80.0, 100.0)), PlumberRequiredFieldError } ); 
    test.done();
  },
  'Test Update Plumber mandatory lastName': function (test) {
    var plumber = new Plumber();
    test.throws( function() { plumber.execute(new UpdatePlumber("134564","Joe", null, 80.0, 100.0)), PlumberRequiredFieldError } ); 
    test.done();
  }};
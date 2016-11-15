import CreatePlumber from '../commands/CreatePlumber';
import UpdatePlumber from '../commands/UpdatePlumber';

// Events:
import PlumberHired from '../events/PlumberHired';
import PlumberUpdated from '../events/PlumberUpdated';
import RateChanged from '../events/RateChanged';
import MadeAvailableForScheduling from '../events/MadeAvailableForScheduling';

export default class Plumber {
  constructor() {
    this._id = null;
    this._regularRate = null;
    this._overtimeRate = null;
  }

  hydrate(evt) {
      if (evt instanceof MadeAvailableForScheduling) {
        this._onPlumberIsAvailable(evt);
      } 
      if (evt instanceof PlumberHired) {
        this._onPlumberHired(evt);
      }
      if (evt instanceof RateChanged) {
        this._onRateChanged(evt);
      }
  }

  _onPlumberHired(evt) {
    this._id = evt.plumberId;
    this._regularRate = evt.regularRate;
    this._overtimeRate = evt.overtimeRate;  }

  _onRateChanged(evt) {
    this._regularRate = evt.regularRate;
    this._overtimeRate = evt.overtimeRate;
  }

  _onPlumberIsAvailable(evt) {
    //TODO: Implement.
  }

  execute(command) {
    if (command instanceof CreatePlumber) {
      return this._createPlumber(command);
    }
    if (command instanceof UpdatePlumber) {
      return this._updatePlumber(command);
    }
    throw new Error('Unknown command.');
  }

  _createPlumber(command) {
    if (this._id) {
      throw new Error('Plumber already exists.');
    }
    // validate(command);
    var result = [];
    result.push(new PlumberHired(command.plumberId, command.firstName, command.lastName, command.regularRate, command.overtimeRate));
    return result;
  }

  _updatePlumber(command) {
    validate(command);    
    var result = [];
    //TODO: Only publish a PlumberUpdated event if the first- or lastname actually changed.
    result.push(new PlumberUpdated(command.plumberId, command.firstName, command.lastName));

    if(this._regularRate !== command.regularRate || this._overtimeRate !== command.overtimeRate) {
      result.push(new RateChanged(this._id, command.regularRate, command.overtimeRate));
    }
    return result;
  }
};

function validate(command) {
  if(!command.firstName) {
    throw new PlumberRequiredFieldError('Required field: Firstname missing.')
  }
  if(!command.lastName) {
    throw new PlumberRequiredFieldError('Required field: Lastname missing.')
  }
  if(command.regularRate <= 0.0 || command.overtimeRate <= 0.0) {
    throw new PlumberInvalidFieldValueError('Rates must be greater than zero.')
  }
}

function PlumberRequiredFieldError(message) {
  this.name = "PlumberRequiredFieldError";
  this.message = (message || "");
}
PlumberRequiredFieldError.prototype = Error.prototype;

function PlumberInvalidFieldValueError(message) {
  this.name = "PlumberInvalidFieldValueError";
  this.message = (message || "");
}
PlumberInvalidFieldValueError.prototype = Error.prototype;
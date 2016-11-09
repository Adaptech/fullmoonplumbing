import CreatePlumber from '../commands/CreatePlumber';
import UpdatePlumber from '../commands/UpdatePlumber';

// Events:
import PlumberCreated from '../events/PlumberCreated';
import PlumberUpdated from '../events/PlumberUpdated';
import RateChanged from '../events/RateChanged';
import PlumberHired from '../events/PlumberHired';

export default class Plumber {
  constructor() {
    this._id = null;
    this._firstName = null;
    this._lastName = null;
    this._regularRate = null;
    this._overtimeRate = null;
  }

  hydrate(evt) {
    if (evt instanceof PlumberHired) {
      this._onPlumberHired(evt);
    } 
    if (evt instanceof PlumberCreated) {
      this._onPlumberCreated(evt);
    }
    if (evt instanceof PlumberCreated) {
      this._onPlumberCreated(evt);
    }
    if (evt instanceof PlumberUpdated) {
      this._onPlumberUpdated(evt);
    }
    if (evt instanceof RateChanged) {
      this._onRateChanged(evt);
    }  }


  _onPlumberCreated(evt) {
    this._id = evt.plumberId;
    this._firstName = evt.firstName;
    this._lastName = evt.lastName;
  }

  _onPlumberUpdated(evt) {
    this._id = evt.plumberId;
    this._firstName = evt.firstName;
    this._lastName = evt.lastName;
  }

  _onRateChanged(evt) {
    this._id = evt.plumberId;
    this._regularRate = evt.regularRate;
    this._overtimeRate = evt.overtimeRate;
  }

  _onPlumberHired(evt) {
    this._id = evt.plumberId;
    this._regularRate = evt.regularRate;
    this._overtimeRate = evt.overtimeRate;
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
    if(!command.firstName) {
      throw new PlumberRequiredFieldError('Required field: Firstname missing.')
    }
    if(!command.lastName) {
      throw new PlumberRequiredFieldError('Required field: Lastname missing.')
    }

    var result = [];
    result.push(new PlumberCreated(command.plumberId, command.firstName, command.lastName));

    if(command.regularRate && command.overtimeRate){
        result.push(new PlumberHired(command.plumberId, command.regularRate, command.overtimeRate));      
    } 

    return result;
  }

  _updatePlumber(command) {
    return new PlumberUpdated(command.plumberId, command.firstName, command.lastName, command.regularRate, command.overtimeRate);
  }
};

function PlumberRequiredFieldError(message) {
  this.name = "PlumberRequiredFieldError";
  this.message = (message || "");
}
PlumberRequiredFieldError.prototype = Error.prototype;
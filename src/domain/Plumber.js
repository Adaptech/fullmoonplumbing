import CreatePlumber from '../commands/CreatePlumber';
import UpdatePlumber from '../commands/UpdatePlumber';

// Events:
import PlumberHired from '../events/PlumberHired';
import PlumberUpdated from '../events/PlumberUpdated';
import RateChanged from '../events/RateChanged';
import PlumberIsAvailable from '../events/PlumberIsAvailable';
import PlumberIsUnavailable from '../events/PlumberIsUnavailable';

export default class Plumber {
  constructor() {
    this._id = null;
    this._regularRate = null;
    this._overtimeRate = null;
  }

  hydrate(evt) {
      if (evt instanceof PlumberIsAvailable) {
        this._onPlumberIsAvailable(evt);
      } 
      if (evt instanceof PlumberHired) {
        this._onPlumberCreated(evt);
      }
      if (evt instanceof RateChanged) {
        this._onRateChanged(evt);
      }
  }

  _onPlumberCreated(evt) {
    this._id = evt.plumberId;
  }

  _onRateChanged(evt) {
    this._regularRate = evt.regularRate;
    this._overtimeRate = evt.overtimeRate;
  }

  _onPlumberIsAvailable(evt) {
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
    result.push(new PlumberHired(command.plumberId, command.firstName, command.lastName));

    if(command.regularRate && command.overtimeRate){
        if(command.regularRate > 0.0 && command.overtimeRate > 0.0) {
          result.push(new PlumberIsAvailable(command.plumberId, command.regularRate, command.overtimeRate));      
        }
    } 
    return result;
  }

  _updatePlumber(command) {
    if(!command.firstName) {
      throw new PlumberRequiredFieldError('Required field: Firstname missing.')
    }
    if(!command.lastName) {
      throw new PlumberRequiredFieldError('Required field: Lastname missing.')
    }

    var result = [];
    //TODO: Only publish a PlumberUpdated event if the first- or lastname actually changed.
    result.push(new PlumberUpdated(command.plumberId, command.firstName, command.lastName));

    if(this._regularRate !== command.regularRate || this._overtimeRate !== command.overtimeRate) {
      result.push(new RateChanged(this._id, command.regularRate, command.overtimeRate));
    }

    if(command.regularRate === 0.0 || command.overtimeRate === 0.0) {
      result.push(new PlumberIsUnavailable(this._id, "Missing rate."));
    }
    return result;
  }
};

function PlumberRequiredFieldError(message) {
  this.name = "PlumberRequiredFieldError";
  this.message = (message || "");
}
PlumberRequiredFieldError.prototype = Error.prototype;
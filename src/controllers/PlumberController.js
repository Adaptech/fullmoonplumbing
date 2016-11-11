import uuid from 'uuid';
import Plumber from '../domain/Plumber';
import CreatePlumber from '../commands/CreatePlumber';
import UpdatePlumber from '../commands/UpdatePlumber';

export default class PlumberController {
  constructor(app, readRepository, commandHandler, logger) {
    function createPlumber(req, res) {
      const command = new CreatePlumber(uuid.v4(), req.body.firstName, req.body.lastName, req.body.regularRate, req.body.overtimeRate);
      commandHandler(command.plumberId, new Plumber(), command)
          .then(() => {
            res.json(command);
          })
          .catch(err => {
            logger.error(err.stack);
            res.status(500).json({message: err.message});
          });
    }
    app.post('/api/v1/plumber/create', createPlumber);
  }
}
export default class RateSheetController {
  constructor(app, readRepository, commandHandler, logger) {

    function getRateSheet(req, res) {
      readRepository.findAll('ratesheet')
          .then(results => {
            res.json(results);
          })
          .catch(err => {
            logger.error(err);
            res.status(500).json(err);
          });
    }
    app.get('/api/v1/ratesheets', getRateSheet);
  }
}

const models = require('../models/models');

/**
  Middleware for identifing app
  if the app is identified, the app property on request will be set with appName {string} and appId {number}
*/
const identifyApp = (req,res,next) => {
  if (!req.auth) {
    return next();
  }

  var appKey = req.auth.appKey;
  var apiKey = req.auth.apiKey;

  var app = {};
	
  models.app.findOne({ where: {
    $and: [
      { appKey: appKey }, { apiKey: apiKey }
    ]
  }})
  .then(app => {
     if (app) {
          req.app = app;
      } else {
          req.app = false;
      }

      next();
  }, err => res.status(502).send(err));
};

module.exports = identifyApp;

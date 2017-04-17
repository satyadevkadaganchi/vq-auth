var async = require("async");
var AuthService = require("../services/AuthService.js");

const checkToken = (appId,token,callback) => {
	if (!appId || !token) {
		return callback({
      status: 400,
      code: "INITIAL_PARAMS"
    });
	}
  
  async.waterfall([
        callback => AuthService.checkToken(appId, token, (err, rUser) => {
          if (err) {
            return callback(err);
          }
          
          if (!rUser) {   
            return callback({
              status: 400, 
              code: "WRONG_TOKEN"
            });  
          }

          return callback(null, rUser);
        }),
  ], (err, rUser) => callback(err, rUser));
}

module.exports = {
  checkToken: checkToken
};

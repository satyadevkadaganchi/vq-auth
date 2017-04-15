var async = require("async");
var AuthService = require("../services/AuthService.js");

function checkToken(appId,token,callback) {
  
	if(!appId||!token){
		return callback({status:400,code:"INITIAL_PARAMS"});
	}
  var User;
  async.waterfall([
        function(callback) {
      AuthService.checkToken(appId,token,function(err,rUser){
        if (err) {
          return callback(err);
        }
          if(!rUser){   
             return callback({status:400,code:"WRONG_TOKEN"});  
          }
             User = rUser;
             return callback();
      });
    },
  ], function(err) {
    return callback(err, User)
  });
}

module.exports = {
  checkToken : checkToken
};
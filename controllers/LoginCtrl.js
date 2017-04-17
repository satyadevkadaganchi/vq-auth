var async = require("async");
var AuthService = require("../services/AuthService.js");

function loginWithPassword(appId,email,password,callback) {
 	
	if(!appId||!email||!password){
		return callback({code:"INITIAL_PARAMS"});
	}

  var User = {}, Token;

	if (password) {
		User.password = AuthService.generateHashSync(password);
	}
	
  async.waterfall([
    callback => {
        AuthService.getUserIdFromEmail(appId, email, (err, rUser) => {
          if (err) {
            return callback(err);
          }

          if (!rUser) {
            return callback({ status:400, code:"EMAIL_NOT_FOUND" });  
          }
          
          User = rUser;

          return callback();
        });
    },
    function(callback) {
      AuthService.checkPassword(appId,User.userId,password,function(err,checkResult){
        if (err) {
          return callback(err);
        }
         if(!checkResult){
           return callback({status:400,code:"WRONG_PASSWORD"});
         }
          return callback();
      });
    },
        function(callback) {
				
      AuthService.createNewToken(appId,User.userId,function(err,rToken){
        if (err) {
          return callback(err);
        }
          Token = rToken;
          return callback();
      });
    }, 
  ], function(err) {
    callback(err, Token)
  });
}

module.exports = {
	loginWithPassword : loginWithPassword,
};


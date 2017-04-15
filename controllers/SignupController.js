var async = require("async");
var AuthService = require("../services/AuthService.js");

function createLocalAccount(appId,email,password,callback) {
  
  if(!appId||!email||!password){
    return callback({status:400,code:"INITIAL_PARAMS"});
  }
  
  var newUser = {}, Token;
	if(password){
		newUser.password = AuthService.generateHashSync(password);
	}
	
  async.waterfall([
    function(callback) {
      AuthService.createNewUser(appId,function(err,rNewUser){
        if (err) {
          return callback(err);
        }
          newUser = rNewUser;
          return callback();
      });
    },
    function(callback) {
      AuthService.createNewEmail(appId,newUser.userId,email,function(err){
        if (err) {
          return callback(err);
        }
          return callback();
      });
    },  
    function(callback) {
      AuthService.createNewPassword(appId,newUser.userId,password,function(err){
        if (err) {
          return callback(err);
        }
          return callback();
      });
    }, 
        function(callback) {
      AuthService.createNewToken(appId,newUser.userId,function(err,rToken){
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
	createLocalAccount : createLocalAccount,
};
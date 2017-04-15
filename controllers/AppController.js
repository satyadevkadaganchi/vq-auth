var async = require("async");
var AppService = require("../services/AppService.js");

function getAppUsers(appId,opts,callback) {

  if (!appId) {
    return callback({
      status: 400,
      code: "INITIAL_PARAMS"
    });
  }
  var User;
  async.waterfall([
    function(callback) {
      AppService.getAppUsers(appId,{},function(err, rUsers) {
        if (err) {
          return callback(err);
        }

        return callback(null, rUsers);
      });
    },
    function(Users, callback) {
      async.eachLimit(Users, 5, function(User, callback) {

        AppService.getUserEmails(appId,User.user_id,{},function(err, rEmails) {
          if (err) {
            return callback(err);
          }
          console.log(rEmails);
          Users[Users.indexOf(User)].Emails = rEmails;
          callback();
        });
      }, function(err) {
          callback(err, Users);
        });
    }
  ], function(err, Users) {
    return callback(err, Users);
  });
}


function getUserEmails(appId,userId,callback) {

  if (!appId||!userId) {
    return callback({
      status: 400,
      code: "INITIAL_PARAMS"
    });
  }
  async.waterfall([
    function(callback) {
      AppService.getUserEmails(appId,userId,{},function(err, rUserEmails) {
        if (err) {
          return callback(err);
        }

        return callback(null, rUserEmails);
      });
    },
  ], function(err, rUserEmails) {
    return callback(err, rUserEmails);
  });
}

module.exports = {
  getUserEmails : getUserEmails,
  getAppUsers: getAppUsers
};
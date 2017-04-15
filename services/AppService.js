var async = require("async");
var pool = require("./../config/db.js").pool;

function getApps(accountId, callback) {
	var sql = "SELECT app_id, app_name FROM app WHERE owner_user_id = ? ORDER BY app_name";
	pool.query(sql, [accountId], function(err, rApps) {
		if (err) {
			return callback(err);
		}
		return callback(null,rApps);
	});
}

function getAppUsers(appId,opts,callback) {
  
    opts = opts ? opts : {};
    opts.limit = opts.limit ? opts.limit : 100;
  
	var sql = "SELECT * FROM user AS user";
    sql += " WHERE user.app_id = ? ORDER BY user.timestamp DESC LIMIT ?";

	pool.query(sql, [appId,opts.limit], function(err, rUsers) {
		if (err) {
			return callback(err);
		}
		return callback(null,rUsers);
	});
}

function getUserProps(appId,userId,opts,callback) {
    opts = opts ? opts : {};
    opts = opts.limit ? opts.limit : 100;
  
	  var sql = "SELECT * FROM user_prop AS prop";
    sql += " WHERE user_id = ? ORDER BY prop.prop_key";
	pool.query(sql, [appId], function(err, rApps) {
		if (err) {
      console.error(err);
			return callback(err);
		}
		return callback(null,rApps);
	});
}

function getUserEmails(appId,userId,opts,callback) {
	  var sql = "SELECT * FROM user_emails AS email";
    sql += " WHERE email.app_id = ? AND email.user_id = ? ORDER BY email.email";
	pool.query(sql, [appId,userId], function(err, rEmails) {
		if (err) {
      console.error(err);
			return callback(err);
		}
		return callback(null,rEmails);
	});
}

module.exports = {
  getApps:getApps,
  getAppUsers:getAppUsers,
  getUserEmails:getUserEmails,
  getUserProps:getUserProps
};
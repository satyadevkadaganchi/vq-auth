var bcrypt = require('bcrypt-nodejs');
var async = require("async");
var randtoken = require('rand-token');
var pool = require("./../config/db.js").pool;

var logIndex = "[AuthService]";

function generateHashSync(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPasswordSync(password, encryptedPassword) {
	if (!password || !encryptedPassword) {
		console.error(logIndex, "validPasswordSync", "initial arguments");
		return false;
	}
	return bcrypt.compareSync(password, encryptedPassword);
}

function checkIfEmailAvailable(email, callback) {
	var sql = "SELECT * FROM user WHERE email = ?";
	pool.query(sql, [email], function(err, result) {
		if (err) {
			return callback(err);
		}

		if (result.length) {
			return callback(null, false);
		}
		return callback(null, true);
	});
}

function logLogin(userId, medium) {
	if (!userId) {
		return console.error("logLogin emptry userId")
	} else {
		console.log("UserId", userId, "logged in.");
	}
	var loginObj = {};
	loginObj.user_id = userId;
	if (medium) {
		loginObj.medium = medium;
	}

	pool.query("INSERT INTO login_history SET ?", loginObj, function(err, result) {
		return err ? console.error(err) : true;
	});
}


function createNewUser(appId, callback) {
	var newUser = {
		appId: appId
	};
	var sql = "INSERT INTO user SET app_id = ?";
	pool.query(sql, [appId], function(err, result) {
		if (err) {
			return callback(err);
		}
		newUser.userId = result.insertId;
		return callback(null, newUser);
	});
}

function createNewPassword(appId, userId, password, callback) {
	if (!userId || !password) {
		return callback("initial params");
	}

	var newPassword = {};

	newPassword.app_id = appId;
	newPassword.user_id = userId;
	newPassword.password = generateHashSync(password);

	var sql = "INSERT INTO user_password SET ?";

	pool.query(sql, newPassword, function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback();
	});
}


function createNewEmail(appId, userId, email, callback) {
	if (!userId || !email) {
		return callback({
			code: "INITIAL_PARAMS"
		});
	}

	var newEmail = {};

	newEmail.app_id = appId;
	newEmail.user_id = userId;
	newEmail.email = email;

	async.series([

		function(callback) {

			var sql = "SELECT id FROM user_emails WHERE app_id = ? AND email = ?";
			pool.query(sql, [appId, email], function(err, result) {
				if (err) {
					return callback(err);
				}
				if (result.length)
					return callback({
						code: "EMAIL_EXISTS"
					});

				return callback();
			});

		},
		function(callback) {
			var sql = "INSERT INTO user_emails SET ?";
			pool.query(sql, newEmail, function(err, result) {
				if (err) {
					return callback(err);
				}
				return callback();
			});
		}
	], function(err) {
		callback(err);
	});
}

function createLocalAccount (appId, email, password, callback) {
	var newUser = {},
		newEmail = {},
		newPassword = {};

	if (password) {
		newUser.password = generateHashSync(password);
	}

	async.waterfall([
		function(callback) {
			var sql = "INSERT INTO user SET app_id = ?";
			pool.query(sql, [appId], function(err, result) {
				if (err) {
					return callback(err);
				}
				newUser.user_id = result.insertId;
				return callback();
			});
		},

		function(callback) {
			var sql = "INSERT INTO user_profile SET ?";
			pool.query(sql, newProfile, function(err, result) {
				if (err) {
					return callback(err);
				}

				return callback();
			});
		},
	], function(err) {
		callback(err, newUser)
	});
}

function getUserIdFromNetwork(network, networkId, callback) {
	var sql = "SELECT user.user_id AS userId FROM user AS user";
	sql += " INNER JOIN user_networks AS network";
	sql += " ON network.user_id = user.user_id"
	sql += " WHERE network.network_id = ? AND network.network = ?";

	pool.query(sql, [networkId, network], function(err, result) {
		if (err) {
			return callback(err);
		}
		if (result.length) {
			return callback(null, result[0])
		} else {
			return callback(null, false);
		}
	});
}

function updateNetworkToken(userId, network, networkId, token) {
	var sql = "UPDATE user_networks";
	sql += " SET token = ? WHERE network_id = ? AND user_id = ? AND network = ?";
	pool.query(sql, [token, networkId, userId, network], function(err, result) {
		if (err) {
			return console.error(err);
		}
	});
}

function createNewNetwork(appId, userId, network, networkId, token, refreshToken, callback) {
	if (!appId || !userId || !network || !networkId || !token) {
		return callback({
			code: "INITIAL_PARAMS"
		});
	}

	var newNetwork = {
		app_id: appId,
		user_id: userId,
		network: network,
		network_id: networkId,
		token: token,
		refresh_token: refreshToken,
	}

	pool.query("INSERT INTO user_networks SET ?", newNetwork, function(err, result) {
		return callback(err);
	});
}

function createNewToken(appId, userId, callback) {
	var token = randtoken.generate(250);
	var tokenObj = {
		token: token,
		userId: userId,
		appId: appId
	};

	var sql = "INSERT INTO user_tokens SET token = ?, user_id = ?, app_id = ?";
	pool.query(sql, [tokenObj.token, tokenObj.userId, tokenObj.appId], function(err, result) {
		if (err) {
			return callback(err);
		}
		console.log(tokenObj);
		return callback(null, tokenObj);
	});
}

function checkToken(appId, token, callback) {
	var sql = "SELECT user_id AS userId, token AS token FROM user_tokens WHERE app_id = ? AND token = ? AND deleted = 0";
	pool.query(sql, [appId, token], function(err, result) {
		if (err) {
			return callback(err);
		} else {
			if (result.length) {
				return callback(null, result[0]);
			} else {
				return callback(null, false);
			}
		}
	});
}

function checkPassword(appId, userId, password, callback) {
	if (!appId || !userId || !password) {
		return callback({
			code: "INITIAL_PARAMS"
		});
	}

	var sql = "SELECT password FROM user_password WHERE user_id = ? AND app_id = ?";

	pool.query(sql, [userId, appId], function(err, result) {
		if (err) {
			return callback(err);
		} else {
			if (result.length) {
				return callback(null, validPasswordSync(password, result[0].password));
			} else {
				return callback(null, false);
			}
		}
	});
}

function getUserIdFromEmail(appId, email, callback) {
	var sql = "SELECT user_id AS userId FROM user_emails WHERE app_id = ? AND email = ?";
	pool.query(sql, [appId, email], function(err, result) {
		if (err) {
			return callback(err);
		}
		if (result.length) {
			return callback(null, result[0]);
		}

		return callback(null, false);
	});
}

var addUserProp = function(userId, propKey, propValue, callback) {
	if (!userId || !propKey) {
		return callback({
			status: 400,
			code: "INITIAL_PARAMS"
		});
	}

	var sql = "SELECT id FROM user_props WHERE user_id = ? AND prop_key = ?";

	pool.query(sql, [userId, propKey], function(err, result) {
		if (err) {
			console.error(err);
			return callback(err);
		}

		var insertSql = "INSERT INTO user_props SET prop_value = ?, prop_key = ?, user_id = ?";
		var updateSql = "UPDATE user_props SET prop_value = ? WHERE prop_key = ? AND user_id = ?";
		var commitSql = result.length ? updateSql : insertSql;
	
		pool.query(commitSql, [propValue,propKey,userId], function(err, result) {
			if (err) {
				return callback(err);
			}
			return callback();
		});
	});
};

module.exports = {
	createNewUser: createNewUser,
	createNewPassword: createNewPassword,
	createNewEmail: createNewEmail,
	createNewToken: createNewToken,
	createNewNetwork: createNewNetwork,
	addUserProp: addUserProp,
	checkPassword: checkPassword,
	checkToken: checkToken,
	getUserIdFromEmail: getUserIdFromEmail,
	getUserIdFromNetwork: getUserIdFromNetwork,
	updateNetworkToken: updateNetworkToken,
	checkIfEmailAvailable: checkIfEmailAvailable,
	logLogin: logLogin,
	generateHashSync: generateHashSync,
	validPasswordSync: validPasswordSync,
};
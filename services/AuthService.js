const bcrypt = require('bcrypt-nodejs');
const async = require("async");
const randtoken = require('rand-token');
const pool = require("./../config/db.js").pool;
const models = require("../models/models");
const logIndex = "[AuthService]";

const generateHashSync = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const validPasswordSync = (password, encryptedPassword) => {
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

function createNewUser (appId, callback) {
	return models.user
		.create({ appId: appId })
		.then(instance => callback(null, instance), err => callback(err));
}

function createNewPassword (appId, userId, password, callback) {
	models.userPassword
		.create({ 
			appId: appId, 
			userId: userId, 
			password: generateHashSync(password)
		})
		.then(instance => callback(), err => callback(err));
}

const createNewEmail = (appId, userId, email, callback) => async.series([
	callback => models.userEmail
		.findOne({
			where: {
				$and: [ { appId }, { email } ]
			}
		})
		.then(result => {
			if (result) {
				return callback({
					code: "EMAIL_EXISTS"
				});
			}

			return callback();
		}),
	callback => {
		models.userEmail
		.create({
			appId: appId, 
			userId: userId, 
			email: email
		})
		.then(instance => callback(), err => callback(err));
	}
], err => callback(err));


// migrated to new db names
function getUserIdFromNetwork(network, networkId, callback) {
	var sql = "SELECT user.id AS userId FROM user AS user";
	sql += " INNER JOIN userNetwork AS network";
	sql += " ON network.userId = user.id"
	sql += " WHERE network.networkId = ? AND network.network = ?";

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

const updateNetworkToken = (userId, network, networkId, token) =>
	models.userToken
		.update({
			token: token
		}, {
			where: {
				networkId: networkId,
				userId: userId
			}
		})
		.then(() => {}, err => console.error(err));

const createNewNetwork = (appId, userId, network, networkId, token, refreshToken, callback) =>
	models.userNetwork
		.create({
			appId: appId,
			userId: userId,
			network: network,
			networkId: networkId,
			token: token,
			refreshToken: refreshToken
		})
		.then(instance => callback(), err => callback(err));

const createNewToken = (appId, userId, callback) =>
	models.userToken
		.create({
			token: randtoken.generate(250),
			userId: userId,
			appId: appId
		})
		.then(instance => callback(null, instance), err => callback(err));

const checkToken = (appId, token, callback) => models.userToken
	.findOne({
		token: token,
		appId: appId
	})
	.then(instance => callback(null, instance || false), err => callback(err));

const checkPassword = (appId, userId, password, callback) =>
	models.userPassword
		.findOne({
			userId: userId,
			appId: appId
		})
		.then(instance => instance ? callback(null, validPasswordSync(password, instance.password)) : false, err => callback(err));

const getUserIdFromEmail = (appId, email, callback) => {
	return models.userEmail
		.findOne({
			appId: appId,
			email: email,
			appId: appId
		})
		.then(instance => callback(null, instance || false), err => callback(err))
};

var addUserProp = function(userId, propKey, propValue, callback) {
	if (!userId || !propKey) {
		return callback({
			status: 400,
			code: "INITIAL_PARAMS"
		});
	}

	var sql = "SELECT id FROM userProp WHERE userId = ? AND propKey = ?";

	pool.query(sql, [ userId, propKey ], function(err, result) {
		if (err) {
			console.error(err);
			return callback(err);
		}

		var insertSql = "INSERT INTO userProp SET propValue = ?, propKey = ?, userId = ?";
		var updateSql = "UPDATE userProp SET propValue = ? WHERE propKey = ? AND userId = ?";
		var commitSql = result.length ? updateSql : insertSql;
	
		pool.query(commitSql, [ propValue, propKey, userId ], function(err, result) {
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
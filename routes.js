const AuthController = require("./controllers/AuthCtrl.js");
const NetworkController = require("./controllers/NetworkCtrl.js");
const SignupController = require("./controllers/SignupCtrl.js");
const LoginController = require("./controllers/LoginCtrl.js");

const sendResponse = (res, err, data) => {
	if (err) {
		if (err.status) {
			return res.status(err.status).send(err);
		} 
			
		if (err.code) {
			return res.status(400).send(err);
		}

		return res.status(500).send(err);
	}

	return res.status(200).send(data);
};

module.exports = app => {
	app.post('/auth/token', (req, res, next) => {
		return AuthController.checkToken(req.app.id, req.auth.token, (err, rUser) => {
			return sendResponse(res, err, rUser)
		});
	});  
	
	app.post('/auth/networks/facebook', (req,res) => {
		var appId = req.app ? req.app.id : false;
		var token = req.body.token;
		var refreshToken = req.body.refreshToken;
		var Profile = req.body.Profile;

		NetworkController.connectToFacebook(appId, token, refreshToken, Profile, (err, rUser) => {
			return sendResponse(res,err,rUser);
    	});
	});

	app.post('/auth/local/signup',  (req, res) => {
		const appId = req.app ? req.app.id : false;
		const email = req.body.email;
		const password = req.body.password;

		SignupController.createLocalAccount(appId, email, password, (err, rUser) => {
			return sendResponse(res,err,rUser);
		});
	});

	app.post('/auth/local/login',  (req, res) => {
		var appId = req.app ? req.app.id : false;
		var email = req.body.email;
		var password = req.body.password;
    
		LoginController.loginWithPassword(appId, email, password, (err, rUser) => {
			return sendResponse(res, err, rUser);
		});
	});
};

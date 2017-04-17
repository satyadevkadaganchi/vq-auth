const AuthController = require("./controllers/AuthController.js");
const NetworkController = require("./controllers/NetworkController.js");
const SignupController = require("./controllers/SignupController.js");
const LoginController = require("./controllers/LoginController.js");

const sendResponse = (res, err, data) => {
	if (err) {
		if (err.status) {
			res.status(err.status).send(err);
		} else {
			console.log(err);
			res.status(500).send(err);
		}
	} else {
		res.status(200).send(data);
	}
};

module.exports = app => {
	app.post('/auth/token', (req, res, next) => {
		return AuthController
		.checkToken(req.app.id, req.auth.token, (err, rUser) => {
			return sendResponse(res, err, rUser)
		});
	});  
	
	app.post('/auth/networks/facebook',function(req,res){
		var appId = req.app ? req.app.id : false;
		var token = req.body.token;
		var refreshToken = req.body.refreshToken;
		var Profile = req.body.Profile;

		NetworkController.connectToFacebook(appId, token, refreshToken, Profile, function(err,rUser) {
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

	app.post('/auth/local/login', function (req,res) {
		var appId = req.app ? req.app.id : false;
		var email = req.body.email;
		var password = req.body.password;
    
		LoginController.loginWithPassword(appId,email,password, function(err,rUser) {
			if (err) {
				console.error(err);

				if (err.code) {
					return res.status(400).send(err);
				}
				
				return res.status(500).send(err);
			}
				
			res.status(200).send(rUser);
		});
	});
};

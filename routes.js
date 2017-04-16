var AuthController = require("./controllers/AuthController.js");
var NetworkController = require("./controllers/NetworkController.js");
var SignupController = require("./controllers/SignupController.js");
var LoginController = require("./controllers/LoginController.js");

var sendResponse = function(res,err,data){
	if(err){
		if(err.status){
			res.status(err.status).send(err);
		}else{
			console.log(err);
			res.status(500).send(err);
		}
	}else{
		res.status(200).send(data);
	}
}

module.exports = function(app) {

	app.post('/auth/token', function(req, res, next) {
		AuthController.checkToken(req.app.appId,req.auth.token, function (err,rUser) {
		return sendResponse(res,err,rUser);
		});
	});  
	
	app.post('/auth/networks/facebook',function(req,res){
		var appId = req.app ? req.app.appId : false;
		var token = req.body.token;
		var refreshToken = req.body.refreshToken;
		var Profile = req.body.Profile;

		NetworkController.connectToFacebook(appId, token, refreshToken, Profile, function(err,rUser) {
			return sendResponse(res,err,rUser);
    	});
	});

	app.post('/auth/local/signup', function(req,res) {
		var appId = req.app ? req.app.appId : false;
		var email = req.body.email;
		var password = req.body.password;

		SignupController.createLocalAccount(appId,email,password,function(err,rUser){
			return sendResponse(res,err,rUser);
		});
	});

	
	app.post('/auth/local/login', function(req,res) {
		var appId = req.app ? req.app.appId : false;
		var email = req.body.email;
		var password = req.body.password;
    
		LoginController.loginWithPassword(appId,email,password,function(err,rUser){
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

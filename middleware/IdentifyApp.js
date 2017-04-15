var pool = require("./../config/db.js").pool;

module.exports = identifyApp;

/**
  Middleware for identifing app
  if the app is identified, the app property on request will be set with appName {string} and appId {number}
*/
function identifyApp(req,res,next){

  if(!req.auth){
	console.log("[ViciAuth] [WARNING] No authentification provided!");
 	return next();
  }

  var appKey = req.auth.appKey;
  var apiKey = req.auth.apiKey;
	

  console.log("[ViciAuth] AppKey: ",appKey);
  console.log("[ViciAuth] ApiKey: ",apiKey);

  var app = {};
	
  var sql = "SELECT app_id AS appId, app_name as appName";
  sql += " FROM app WHERE app_key = ? AND api_key = ?";

  pool.query(sql,[appKey,apiKey],function(err,result){
      if(err){
       return res.status(502).send(err);
      }

      if(result.length){
	app = result[0];
        req.app = app;
    	console.log("[ViciAuth] [OK] %s (id:%s) app identified",app.appId,app.appName);
      } else {
	console.log("[ViciAuth] AppIdentification:  No app found for appKey %s",appKey);
        req.app = false;
      }
    
    next();
  });
}

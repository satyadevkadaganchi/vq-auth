module.exports = readHeaders;

/**
  Reads 'x-auth-viciauth-{token/app-key/api-key}' values from header of the request and assigned them to a property 'auth' of the request 
*/
function readHeaders (req,res,next) {
  console.log(req.headers);
  req.auth = {};
  req.auth.token = req.headers['x-auth-viciauth-token'];
  req.auth.appKey = req.headers['x-auth-viciauth-app-key'];
  req.auth.apiKey = req.headers['x-auth-viciauth-api-key'];

  if( !req.auth.appKey ){
console.log("[ViciAuth] 'x-auth-viciauth-app-key'  header not present");
  }

  if( !req.auth.apiKey ){
console.log("[ViciAuth] 'x-auth-viciauth-api-key' header not present");
  }

  next();
};

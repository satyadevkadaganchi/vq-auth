var cors = require("cors");
var async = require("async");
var express = require("express");

var CONFIG = {
	PORT : 5000,
};

var app = express();

app.use(require("cors")());
app.use(require('body-parser')());
app.use(require("./middleware/ReadHeaders.js"));
app.use(require("./middleware/IdentifyApp.js"));

require("./routes")(app);

var server = app.listen(CONFIG.PORT, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('ViciAuth listening at http://%s:%s', host, port);
});





const cors = require("cors");
const async = require("async");
const express = require("express");
const models = require('./models/models');

const CONFIG = {
	PORT : 5000,
};

const app = express();

app.use(require("cors")());
app.use(require('body-parser')());
app.use(require("./middleware/ReadHeaders.js"));
app.use(require("./middleware/IdentifyApp.js"));

require("./routes")(app);

models.seq.sync().then(() => {
	var server = app.listen(CONFIG.PORT, () => {
		var host = server.address().address;
		var port = server.address().port;

		console.log(`VQ-AUTH listening at http://${host}:${port}`);
	});
});

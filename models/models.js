var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

var sequelize = new Sequelize(process.env.VA_ENV.toLowerCase() === 'production' ? process.env.VQ_VA_DB : 'mysql://root:kurwa@localhost:3306/vq', {
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
});

var db = {};

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.seq = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 50,	
  host     : process.env.VQAUTH_DB_HOST,
  post: 3306,
  user     : process.env.VQAUTH_DB_USER,
  password : process.env.VQAUTH_DB_PASSWORD,
  database : process.env.VQAUTH_DB_NAME || 'user_management'
});

module.exports = {
	pool: pool
};

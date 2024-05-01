
//database connection file 
const env = require('dotenv');
env.config()
const fs = require('fs');
var mysql = require('mysql2');
var conn = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    ssl: {
        ca: fs.readFileSync(__dirname + '/ssl.pem')
    },
    connectTimeout: 25000

})


module.exports = conn;  

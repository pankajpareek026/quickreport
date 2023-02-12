
//database connection file 
var mysql = require('mysql2');
var conn = mysql.createPool({
    host: "sql.freedb.tech",
    user: "freedb_quickreport",
    password: "fUAde$SfZ228N53",
    database: "freedb_main-master",
    connectTimeout:28800
})

module.exports = conn;  

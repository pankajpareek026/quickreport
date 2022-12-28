
//database connection file 
var mysql = require('mysql2');
var conn = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_quickreport",
    password: "fUAde$SfZ228N53",
    database: "freedb_main-master",
    connectTimeout: 288000
    // debug: true

})
// file where 
// CREATE TABLE newUsers(username varchar(50),name varchar(50),emailid varchar(50), sts int,password varchar(50),JoiningDAte varchar(100));
// conn.connect((err) => {

//     if (err) console.log(err)
//     else console.log("connected")
// })
// const q = ` CREATE TABLE newUsers(username varchar(50),name varchar(50),emailid varchar(50), sts int,password varchar(50),JoiningDAte varchar(100));`
// conn.query("show tables", (err, result) => {
//     if (err) console.log(err)
//     console.log(result)
// })
module.exports = conn; //to make variable importable 
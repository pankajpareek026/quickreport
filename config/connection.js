import mongoose from "mongoose";
import DB_NAME from '../constants.js';
import { config } from "./config.js";

<<<<<<< HEAD


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${config.mongoUrl}${DB_NAME}`)
        console.log(`\n MongoDB connected !! ✔️ ✔️  ✅ 👍 `);

    } catch (error) {
        console.log("MONGODB connection FAILED ", error.message);
        process.exit(1)
    }
}

export default connectDB
=======
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
>>>>>>> 2000092782b47e4bfb27a93ed3778ba42875766d

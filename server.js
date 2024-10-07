
import app from "./app.js";
import { config } from "./config/config.js";
import connectDB from './config/connection.js';




app.listen(config.port, (err) => {
    if (err) console.log(err)
    connectDB()
    console.log("listining on ", config.port)
});
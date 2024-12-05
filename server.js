
import app from "./app.js";
import { config } from "./config/config.js";
import connectDB from './config/connection.js';




app.listen(config.port, (err) => {
    connectDB()

    if (err) console.log(err)

    console.log("listining on ", config.port)
});

import app from "./app.js";
import { config } from "./config/config.js";



app.listen(config.port, (err) => {
    if (err) console.log(err)
    console.log("listining on ", config.port)
});
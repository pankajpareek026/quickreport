import mongoose from "mongoose";
import DB_NAME from '../constants.js';
import { config } from "./config.js";



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

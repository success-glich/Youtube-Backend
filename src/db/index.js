import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import vars from "../config/vars.js";

// db is in another continent 
const connectToDB = async () => {

    try {
        console.log(vars.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${vars.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (err) {
        console.log(`MONGODB connection Failed`, err);
        process.exit(1);
    }

}

export default connectToDB;
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// db is in another continent 
const connectToDB = async () => {

    try {
        console.log(process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (err) {
        console.log(`MONGODB connection Failed`, err);
        process.exit(1);
    }

}

export default connectToDB;
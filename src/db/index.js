import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//db is in another cont..
const connectToDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`);

    } catch (err) {
        console.log(`MONGODB connection Failed`, err);
        process.exit(1);
    }

}

export default connectToDB;
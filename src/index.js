// require('dotenv').config({ path: './env' });

import dotenv from "dotenv";
import connectToDB from "./db/index.js";

dotenv.config({
    path: './env'
});


connectToDB();














// optional code
/*import express from 'express';
const app = express();

(async () => {

    try {

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (err) => {
            console.log("ERROR:", err);
            throw err;
        });

        app.listen(process.env.PORT, () => { console.log(`application is listening on port ${process.env.PORT}`) });
    } catch (err) {
        console.log("ERROR: ", err);
        throw err;
    }
})();

*/
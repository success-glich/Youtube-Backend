// require('dotenv').config({ path: './env' });

import dotenv from "dotenv";
import connectToDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
});

const port = process.env.PORT || 8000;


connectToDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("ERROR:", err);
            throw err;
        })
        app.listen(port, () => {
            console.log(`Server is listening on port : ${port} `)
        });

    })
    .catch(
        err => {
            console.log("MONGO db connect fail!!!", err)
        }
    )














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
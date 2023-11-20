import dotenv from 'dotenv';
import { app } from './app.js';
import connectToDB from './db/index.js';

dotenv.config({
    path: './.env'
})


const PORT = process.env.PORT || 8000;
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`☁ Server is running at port :${PORT}`)
    });
}).catch(err => {
    console.log('MONGO db connection failed!!!', err);

});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server and exit process
    server.close(() => process.exit(1));

});
process.on('uncaughtException', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server and exit process
    server.close(() => process.exit(1));

});
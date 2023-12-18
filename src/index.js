import { app } from './app.js';
import connectToDB from './db/index.js';
import vars from './config/vars.js';



const PORT = vars.PORT || 8500;
let server;
connectToDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`☁ Server is running at port :${PORT}`)
    });
}).catch(err => {
    console.log('MONGO db connection failed!!!', err);

});

//Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error: ${err.message}`);
//     //Close server and exit process
//     process.exit(1)

// });
process.on('uncaughtException', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //Close server and exit process
    // server.close(() => process.exit(1));

});
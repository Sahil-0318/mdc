import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from "cors"
import uploadBCA1Meritlist from "./fileUpload/bca1MeritListUpload.js"

// Error log
// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url';

const app = express()
const port = process.env.PORT || 3001
const CORS_URL = process.env.CORS_URL || 'http://127.0.0.1:3000'

// Allow CORS from http://127.0.0.1:3000
app.use(cors({
  origin: CORS_URL
}));

//DB Connection
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  console.log('DB Connected Successfully');
}).catch((err) => {
  console.log(err);
})


// uploadBCA1Meritlist("bca1meritlist1.csv")


import userRouter from './routes/userRouter.js'
import registerRouter from './routes/registerRouter.js'
import loginRouter from './routes/loginRouter.js'
import adminRouter from './routes/adminRouter.js'
import paymentRouter from './routes/paymentRouter.js'
import recordRoomRouter from './routes/recordRoomRouter.js'
import ugRegularSem1Router from './routes/ugRegularSem1Router.js'
import ugRegularSem3Router from './routes/ugRegularSem3Router.js'
import eLibraryRouter from './routes/eLibraryRouter.js'
import apiRouter from './routes/apiRouter.js'
import bca3Router from './routes/bca3Router.js'
import ugRegularPart3Router from './routes/ugRegularPart3Router.js'
import portalOnOffRouter from './routes/portalOnOffRouter.js'
import bonafiedUserRouter from "./routes/certificatesRoutes/bonafiedUserRouter.js"
import certificateAdminRouter from './routes/certificatesRoutes/certificateAdminRouter.js'
import miscellaneousFeeRouter from "./routes/miscellaneousFeeRoutes.js"
import bca1Router from "./routes/bca1Router.js"


// Set template engine
app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


//Load routes
app.use('/', registerRouter)
app.use('/', loginRouter)
app.use('/', userRouter)
app.use('/', adminRouter)
app.use('/', paymentRouter)
app.use('/', recordRoomRouter)
app.use('/', ugRegularSem1Router)
app.use('/', ugRegularSem3Router)
app.use('/', eLibraryRouter)
app.use('/api', apiRouter)
app.use('/', bca3Router)
app.use('/', ugRegularPart3Router)
app.use('/', portalOnOffRouter)
app.use('/', bonafiedUserRouter)
app.use('/', certificateAdminRouter)
app.use('/', miscellaneousFeeRouter)
app.use('/', bca1Router)

// // Get the current directory name (ES Modules don't have __dirname)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the path to the error log file
// const logFilePath = path.join(__dirname, 'error.log');

// // Create a write stream for the log file
// const errorLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// // Redirect stderr to the error log file
// process.stderr.write = errorLogStream.write.bind(errorLogStream);

// // Example usage: log an error to stderr
// console.error("This is an error message");

// // Example function that throws an error
// function throwError() {
//   throw new Error("Something went wrong!");
// }

// // Catch unhandled exceptions and log them to stderr
// process.on('uncaughtException', (err) => {
//   console.error('Unhandled Exception:', err);
// });

// // Catch unhandled promise rejections and log them to stderr
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// // Trigger an error
// try {
//   throwError();
// } catch (err) {
//   console.error(err);
// }

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
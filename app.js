import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from "cors"
import uploadBCA1Meritlist from "./fileUpload/bca1MeritListUpload.js"
import clcList from './fileUpload/uploadCLC.js'
import session from 'express-session'
import flash from 'connect-flash'

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
// clcList("New-CLC-List.csv")


// import userRouter from './routes/userRouter.js'
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
// import bonafiedUserRouter from "./routes/certificatesRoutes/bonafiedUserRouter.js"
import certificateAdminRouter from './routes/certificatesRoutes/certificateAdminRouter.js'
// import miscellaneousFeeRouter from "./routes/miscellaneousFeeRoutes.js"
import bca1Router from "./routes/bca1Router.js"
import bca2Router from "./routes/bca2Router.js"
import interExamFormRouter from './routes/interExamFormRouter.js'
import ugRegularSem4Router from './routes/ugRegularSem4Router.js'
import ugRegSem2_24_28_Router from './routes/subAdminRoutes/ugRegSem2_24_28.js'
import ugRegularSem2_24_28Router from './routes/ugRegularSem2_24_28Route.js'
import interCopmpartmentRouter from './routes/interCompartmentRouter.js'

import Ug_Reg_Sem_1_25_29_Router from './routes/Ug_Reg_Sem_1_25_29_Route/user_Route.js'
import Ug_Reg_Sem_1_25_29_Admin_Router from './routes/Ug_Reg_Sem_1_25_29_Route/admin_Route.js'  
import Ug_Reg_Sem_1_25_29_Payment_Router from './routes/Ug_Reg_Sem_1_25_29_Route/payment_Route.js'

// BCA 2 (24-27)
import BCA_2_24_27_Router from './routes/BCA_2_24_27_Route/user_Route.js'
import BCA_2_24_27_Payment_Router from './routes/BCA_2_24_27_Route/payment_Route.js'
import BCA_2_24_27_Admin_Router from './routes/BCA_2_24_27_Route/admin_Router.js'

// BCA 3 (23-26)
import BCA_3_23_26_Router from './routes/BCA_3_23_26_Route/user_Route.js'
import BCA_3_23_26_Payment_Router from './routes/BCA_3_23_26_Route/payment_Route.js'
import BCA_3_23_26_Admin_Router from './routes/BCA_3_23_26_Route/admin_Router.js'

// -===============New Admins Routes===================
// Admin Auth Routes
import admin_Auth_Route from './routes/Admin_Routes/adminAuthRoute.js'
import vocational_Admin_Route from './routes/Admin_Routes/Admin_Routes/vocationalAdminRoute.js'
import grievance_Admin_Route from './routes/Admin_Routes/Admin_Routes/grievanceAdminRoute.js'
import gallery_Admin_Route from './routes/Admin_Routes/Admin_Routes/galleryAdminRoute.js'

// Super Admin Auth Routes
import vocational_Super_Admin_Route from './routes/Admin_Routes/Super_Admin_Routes/vocationalSuperAdminRoute.js'
import ug_Regular_Super_Admin_Route from './routes/Admin_Routes/Super_Admin_Routes/ugRegularSuperAdminRoute.js'

// ===============New Vocational Routes===================
// Vocational Auth Routes
import vocational_Auth_Routes from './routes/Vocational_Course_Routes/vocationalAuthRoutes.js'
// BCA Students Routes
import BCA_Student_Routes from './routes/Vocational_Course_Routes/BCA_Routes/studentRoutes.js'
import BCA_Payment_Routes from './routes/Vocational_Course_Routes/BCA_Routes/paymentRoutes.js'

// UG Regular Sem 5 2023-2027 Students Routes
import Ug_Reg_Sem_5_23_27_Router from './routes/Ug_Reg_Sem_5_23_27_Route/user_Route.js'
import Ug_Reg_Sem_5_23_27_Admin_Router from './routes/Ug_Reg_Sem_5_23_27_Route/admin_Route.js'

// UG Regular Sem 5 2023-2027 Students Routes
import Ug_Reg_Sem_3_24_28_Router from './routes/Ug_Reg_Sem_3_24_28_Route/user_Route.js'
import Ug_Reg_Sem_3_24_28_Admin_Router from './routes/Ug_Reg_Sem_3_24_28_Route/admin_Route.js'

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        cookie: { maxAge: 6000 },
        resave: false,
        saveUninitialized: false
    })
)

app.use(flash())

// Set template engine
app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


//Load routes
app.use('/', registerRouter)
app.use('/', loginRouter)
// app.use('/', userRouter)
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
// app.use('/', bonafiedUserRouter)
app.use('/', certificateAdminRouter)
// app.use('/', miscellaneousFeeRouter)
app.use('/', bca1Router)
app.use('/', bca2Router)
app.use('/', interExamFormRouter)
app.use('/', ugRegularSem4Router)
app.use('/', ugRegSem2_24_28_Router)
app.use('/', ugRegularSem2_24_28Router)
app.use('/', interCopmpartmentRouter)

app.use('/', Ug_Reg_Sem_1_25_29_Router)
app.use('/', Ug_Reg_Sem_1_25_29_Admin_Router)
app.use('/', Ug_Reg_Sem_1_25_29_Payment_Router)

// BCA 2 (24-27)
app.use('/', BCA_2_24_27_Router)
app.use('/', BCA_2_24_27_Payment_Router)
app.use('/', BCA_2_24_27_Admin_Router)

// BCA 3 (23-26)
app.use('/', BCA_3_23_26_Router)
app.use('/', BCA_3_23_26_Payment_Router)
app.use('/', BCA_3_23_26_Admin_Router)

// =============New Admins Routes=================
// Admin Routes
app.use('/', admin_Auth_Route)
app.use('/', vocational_Admin_Route)
app.use('/', grievance_Admin_Route)
app.use('/', gallery_Admin_Route)

// Super Admin Routes
app.use('/', vocational_Super_Admin_Route)
app.use('/', ug_Regular_Super_Admin_Route)



// =============New Vocational Routes=================
// Vocational Auth Routes
app.use('/', vocational_Auth_Routes)
// BCA Students Routes
app.use('/', BCA_Student_Routes)
app.use('/', BCA_Payment_Routes)


// UG Regular Sem 5 2023-2027 Students Routes
app.use('/', Ug_Reg_Sem_5_23_27_Router)
app.use('/', Ug_Reg_Sem_5_23_27_Admin_Router)

// UG Regular Sem 3 2024-2028 Students Routes
app.use('/', Ug_Reg_Sem_3_24_28_Router)
app.use('/', Ug_Reg_Sem_3_24_28_Admin_Router)


app.listen(port, "0.0.0.0",  () => {
  console.log(`Example app listening on http://0.0.0.0:${port}`)
})
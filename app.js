import 'dotenv/config'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import express from 'express'
const app = express()
const port = process.env.PORT || 3001

//DB Connection
mongoose.connect(process.env.DB_CONNECTION).then(()=>{
    console.log('DB Connected Successfully');
  }).catch((err)=>{
    console.log(err);
})

import userRouter from './routes/userRouter.js'
import registerRouter from './routes/registerRouter.js'
import loginRouter from './routes/loginRouter.js'
import adminRouter from './routes/adminRouter.js'
  

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

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })
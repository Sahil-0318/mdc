import express from 'express'
import {userAuth} from '../middlewares/userMiddleware.js'
import { index, userPage, admissionForm, admissionFormPost, clc, clcPost } from '../controllers/userController.js'
const userRouter = express.Router()
import multer from 'multer'

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`)
//     }
//   })

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})


userRouter.get('/', index)
userRouter.get('/userPage',userAuth, userPage)
userRouter.get('/admissionForm',userAuth, admissionForm)
userRouter.post('/admissionForm',userAuth, upload.array('photo'),  admissionFormPost)
userRouter.get('/clc',userAuth, clc)
userRouter.post('/clc',userAuth, clcPost)

export default userRouter
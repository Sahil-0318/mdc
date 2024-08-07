import express from 'express'
import { userAuth } from '../../middlewares/userMiddleware.js'
import {
    // bonafied
    bonafiedForm, bonafiedFormPost,
    //TC
    tcForm, tcFormPost,
    //Certificate Payment Routes
    certificateFeePay, certificateFeePayPost, certificateReceipt
} from "../../controllers/certificateController/certificateUserController.js"
const bonafiedUserRouter = express.Router()
import multer from 'multer'


const upload = multer({
    storage: multer.memoryStorage()
})

// bonafied
bonafiedUserRouter.get('/bonafied', userAuth, bonafiedForm)
bonafiedUserRouter.post('/bonafied', upload.array('bonafiedFormPhotos'), userAuth, bonafiedFormPost)

//TC
bonafiedUserRouter.get('/tc', userAuth, tcForm)
bonafiedUserRouter.post('/tc', upload.array('TCFormPhotos'), userAuth, tcFormPost)



bonafiedUserRouter.get('/certificateFee/:certificateType', userAuth, certificateFeePay)
bonafiedUserRouter.post('/certificateFeePay', upload.single('paymentSS'), userAuth, certificateFeePayPost)

bonafiedUserRouter.get('/certificateReceipt/:certificateType', userAuth, certificateReceipt)

export default bonafiedUserRouter
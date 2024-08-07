import express from 'express'
import {userAuth} from '../../middlewares/userMiddleware.js'
import {bonafiedForm, bonafiedFormPost, certificateFeePay, certificateFeePayPost, certificateReceipt} from "../../controllers/certificateController/certificateUserController.js"
const bonafiedUserRouter = express.Router()
import multer from 'multer'

  
const upload = multer({
    storage: multer.memoryStorage()
})


bonafiedUserRouter.get('/bonafied', userAuth, bonafiedForm )
bonafiedUserRouter.post('/bonafied', upload.array('bonafiedFormPhotos'), userAuth, bonafiedFormPost )


bonafiedUserRouter.get('/certificateFee/:certificateType', userAuth, certificateFeePay )
bonafiedUserRouter.post('/certificateFeePay',upload.single('paymentSS'), userAuth, certificateFeePayPost )

bonafiedUserRouter.get('/certificateReceipt/:certificateType', userAuth, certificateReceipt )

export default bonafiedUserRouter
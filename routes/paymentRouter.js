import express from 'express'
const paymentRouter = express.Router()
// import {paymentAuth} from '../middlewares/paymentMiddleware.js'
import {userAuth} from '../middlewares/userMiddleware.js'
import multer from 'multer'

import {
    payment,
    paymentInvoice,
    refNoPost,
    getSlipPost
} from '../controllers/paymentController.js'

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

paymentRouter.get('/payment', payment)
paymentRouter.get('/redirect-url/:merchantTransactionId', paymentInvoice)
paymentRouter.post('/refNo',userAuth, upload.single('paymentSS'), refNoPost)
paymentRouter.post('/getSlip',userAuth, getSlipPost)




export default paymentRouter
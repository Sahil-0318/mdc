import express from 'express'
const paymentRouter = express.Router()
import {userAuth} from '../middlewares/userMiddleware.js'
import multer from 'multer'

import {
    payment,
    paymentInvoice,
    paymentCourseId,
    payRefNoForm,
    receiptCourseId,
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
paymentRouter.get('/payment/:course/:id',userAuth, paymentCourseId)
paymentRouter.post('/payRefNoForm',userAuth, upload.single('paymentSS'), payRefNoForm)
paymentRouter.get('/receipt/:course/:id',userAuth, receiptCourseId)
paymentRouter.post('/refNo',userAuth, upload.single('paymentSS'), refNoPost)
paymentRouter.post('/getSlip',userAuth, getSlipPost)




export default paymentRouter
import express from 'express'
const paymentRouter = express.Router()
// import {paymentAuth} from '../middlewares/paymentMiddleware.js'
import {userAuth} from '../middlewares/userMiddleware.js'

import {
    payment,
    paymentInvoice,
    refNoPost,
    getSlipPost
} from '../controllers/paymentController.js'

paymentRouter.get('/payment', payment)
paymentRouter.get('/redirect-url/:merchantTransactionId', paymentInvoice)
paymentRouter.post('/refNo',userAuth, refNoPost)
paymentRouter.post('/getSlip',userAuth, getSlipPost)




export default paymentRouter
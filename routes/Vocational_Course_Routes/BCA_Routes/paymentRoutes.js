import express from 'express'
const BCA_Payment_Routes = express.Router()

import { bcaStudentAuth } from '../../../middlewares/authMiddleware.js'
import { upload } from '../../../middlewares/mediaMiddleware.js'

import { payment, paymentPost, paymentSuccess } from '../../../controllers/Vocational_Course_Controllers/BCA_Controllers/paymentControllers.js'



// Ex - https://domain.com/bca-2025-2028/signup
BCA_Payment_Routes.get("/bca-:coursePart-:courseSession/payment", bcaStudentAuth, payment)
BCA_Payment_Routes.post("/bca-:coursePart-:courseSession/paymentPost", bcaStudentAuth, upload.array('paymentScreenshot'), paymentPost)

BCA_Payment_Routes.get("/bca-:coursePart-:courseSession/paymentSuccess", bcaStudentAuth, paymentSuccess)

export default BCA_Payment_Routes
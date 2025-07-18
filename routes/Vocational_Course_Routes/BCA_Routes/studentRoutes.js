import express from 'express'
const BCA_Student_Routes = express.Router()

import { bcaStudentAuth } from '../../../middlewares/authMiddleware.js'
import { upload } from '../../../middlewares/mediaMiddleware.js'

import { dashboard, part1AdmForm, part1AdmFormPost, part2AdmForm, part2AdmFormPost, part3AdmForm, part3AdmFormPost, feeCheckout, admFormCopy, admReceipt } from '../../../controllers/Vocational_Course_Controllers/BCA_Controllers/studentContollers.js'


// Ex - https://domain.com/bca-2025-2028/signup

BCA_Student_Routes.get("/bca-:courseSession/dashboard", bcaStudentAuth, dashboard)

BCA_Student_Routes.get("/bca-1-:courseSession/admForm", bcaStudentAuth, part1AdmForm)
BCA_Student_Routes.post("/bca-1-:courseSession/admFormPost", bcaStudentAuth, upload.array('studentMedia'), part1AdmFormPost)

BCA_Student_Routes.get("/bca-2-:courseSession/admForm", bcaStudentAuth, part2AdmForm)
BCA_Student_Routes.post("/bca-2-:courseSession/admFormPost", bcaStudentAuth, part2AdmFormPost)

BCA_Student_Routes.get("/bca-3-:courseSession/admForm", bcaStudentAuth, part3AdmForm)
BCA_Student_Routes.post("/bca-3-:courseSession/admFormPost", bcaStudentAuth, part3AdmFormPost)

BCA_Student_Routes.get("/bca-:coursePart-:courseSession/feeCheckout", bcaStudentAuth, feeCheckout)

BCA_Student_Routes.get("/bca-:coursePart-:courseSession/admFormCopy", bcaStudentAuth, admFormCopy)
BCA_Student_Routes.get("/bca-:coursePart-:courseSession/admReceipt", bcaStudentAuth, admReceipt)

export default BCA_Student_Routes
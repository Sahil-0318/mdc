import express from 'express'
const adminRouter = express.Router()
import {adminAuth} from '../middlewares/adminMiddleware.js'

import { 
    adminPage,
    admissionFormList,
    clcList,
    approvedByAdmin,
    findStuInAdmForm
 } 
 from '../controllers/adminController.js'

 adminRouter.get('/adminPage', adminAuth, adminPage)

 adminRouter.get('/admissionFormList', adminAuth, admissionFormList)

 adminRouter.get('/clcList', adminAuth, clcList)
 
 adminRouter.post('/approvedByAdmin', approvedByAdmin)
 
 adminRouter.post('/findStuInAdmForm', adminAuth, findStuInAdmForm)


export default adminRouter
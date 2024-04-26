import express from 'express'
const adminRouter = express.Router()
import {adminAuth} from '../middlewares/adminMiddleware.js'

import { 
    adminPage,
    admissionFormList,
    paidAdmissionFormList,
    unpaidAdmissionFormList,
    genBC2Category,
    bc1SCSTCategory,
    scienceStu,
    artsStu,
    clcList,
    approvedByAdmin,
    findStuInAdmForm,
    datewiseAdmForm
 } 
 from '../controllers/adminController.js'

 adminRouter.get('/adminPage', adminAuth, adminPage)

 adminRouter.get('/admissionFormList', adminAuth, admissionFormList)

 adminRouter.get('/paidAdmissionFormList', adminAuth, paidAdmissionFormList)

 adminRouter.get('/unpaidAdmissionFormList', adminAuth, unpaidAdmissionFormList)

 adminRouter.get('/genBC2Category', adminAuth, genBC2Category)

 adminRouter.get('/bc1SCSTCategory', adminAuth, bc1SCSTCategory)

 adminRouter.get('/scienceStu', adminAuth, scienceStu)

 adminRouter.get('/artsStu', adminAuth, artsStu)

 adminRouter.get('/clcList', adminAuth, clcList)
 
 adminRouter.post('/approvedByAdmin', approvedByAdmin)
 
 adminRouter.post('/findStuInAdmForm', adminAuth, findStuInAdmForm)

 adminRouter.post('/datewiseAdmForm', adminAuth, datewiseAdmForm)


export default adminRouter
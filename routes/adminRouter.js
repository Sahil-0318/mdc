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
    clcApprovedId,
    clcRejectId,
    clcApproved,
    clcRejected,
    approvedByAdmin,
    findStuInAdmForm,
    datewiseAdmForm,
    downloadExcel,
    notice,
    noticePost,
    editNotice,
    editNoticePost,
    deleteNotice,
    // ug regular sem 1 list
    ugRegularSem1List,
    findStuInUGRegSem1Adm,
    ugRegSem1StuView,
    verifyUgRegSem1Stu,
    datewiseUgRegSem1List,
    ugRegSem1Excel
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

 adminRouter.get('/clcApproved/:id', adminAuth, clcApprovedId)
 
 adminRouter.get('/clcReject/:id', adminAuth, clcRejectId)
 
 adminRouter.get('/clcApproved', adminAuth, clcApproved)
 
 adminRouter.get('/clcRejected', adminAuth, clcRejected)

 adminRouter.post('/approvedByAdmin', approvedByAdmin)
 
 adminRouter.post('/findStuInAdmForm', adminAuth, findStuInAdmForm)

 adminRouter.post('/datewiseAdmForm', adminAuth, datewiseAdmForm)

 adminRouter.get('/download-excel', adminAuth, downloadExcel)

 adminRouter.get('/notice', adminAuth, notice)
 
 adminRouter.post('/notice', adminAuth, noticePost)
 
 adminRouter.get('/edit-notice/:id', adminAuth, editNotice)
 
 adminRouter.post('/edit-notice/:id', adminAuth, editNoticePost)
 
 adminRouter.get('/delete-notice/:id', adminAuth, deleteNotice)
 
 //UG Regular Sem -1 List
 
 adminRouter.get('/ugRegularSem1List', adminAuth, ugRegularSem1List)

 adminRouter.post('/ugRegularSem1List', adminAuth, findStuInUGRegSem1Adm)

 adminRouter.get('/student-view/:stuId', adminAuth, ugRegSem1StuView)

 adminRouter.get('/verify-student/:Id', adminAuth, verifyUgRegSem1Stu)

 adminRouter.post('/datewiseUgRegSem1List', adminAuth, datewiseUgRegSem1List)

 adminRouter.get('/ugRegSem1Excel/:course/:findAdmDateFrom/:findAdmDateTo', adminAuth, ugRegSem1Excel)



export default adminRouter
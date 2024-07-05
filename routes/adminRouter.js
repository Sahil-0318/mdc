import express from 'express'
const adminRouter = express.Router()
import { adminAuth } from '../middlewares/adminMiddleware.js'
import multer from 'multer'

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
    ugRegSem1Excel,
    ugRegSem1Password,
    editUserId,
    editUserIdPost,
    findUserId,
    // ug regular sem 1 list
    ugRegularSem3List,
    findStuInUGRegSem3Adm,
    ugRegSem3StuView,
    ugRegSem3StuEdit,
    ugRegSem3StuEditPost,
    //BCA Part 3
    bca3List,
    findStuInbca3Adm,
    bca3StuView,
    bca3StuEdit,
    bca3StuEditPost
}
    from '../controllers/adminController.js'

const storage = multer.diskStorage({})

const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

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

adminRouter.post('/notice', upload.single('noticePDF'), adminAuth, noticePost)

adminRouter.get('/edit-notice/:id', adminAuth, editNotice)

adminRouter.post('/edit-notice/:id', upload.single('noticePDF'), adminAuth, editNoticePost)

adminRouter.get('/delete-notice/:id', adminAuth, deleteNotice)

//UG Regular Sem -1 List

adminRouter.get('/ugRegularSem1List', adminAuth, ugRegularSem1List)

adminRouter.post('/ugRegularSem1List', adminAuth, findStuInUGRegSem1Adm)

adminRouter.get('/student-view/:stuId', adminAuth, ugRegSem1StuView)

adminRouter.get('/verify-student/:Id', adminAuth, verifyUgRegSem1Stu)

adminRouter.post('/datewiseUgRegSem1List', adminAuth, datewiseUgRegSem1List)

adminRouter.get('/ugRegSem1Excel/:course/:findAdmDateFrom/:findAdmDateTo', adminAuth, ugRegSem1Excel)

adminRouter.get('/ugRegSem1Password', adminAuth, ugRegSem1Password)

adminRouter.get('/editUserId/:id', adminAuth, editUserId)

adminRouter.post('/editUserIdForm/:editId', adminAuth, editUserIdPost)

adminRouter.post('/findUserId', adminAuth, findUserId)

// UG Regular Sem - 3 List

adminRouter.get('/ugRegularSem3List', adminAuth, ugRegularSem3List)

adminRouter.post('/ugRegularSem3List', adminAuth, findStuInUGRegSem3Adm)

adminRouter.get('/ugRegularSem3StudentView/:stuId', adminAuth, ugRegSem3StuView)

adminRouter.get('/ugRegularSem3StudentEdit/:stuId', adminAuth, ugRegSem3StuEdit)

adminRouter.post('/ugRegularSem3StudentEditPost/:editId', adminAuth, ugRegSem3StuEditPost)

// BCA Part 3 List
adminRouter.get('/bca3List', adminAuth, bca3List)

adminRouter.post('/bca3List', adminAuth, findStuInbca3Adm)

adminRouter.get('/bca3StudentView/:stuId', adminAuth, bca3StuView)

adminRouter.get('/bca3StudentEdit/:stuId', adminAuth, bca3StuEdit)

adminRouter.post('/bca3StudentEditPost/:editId', adminAuth, bca3StuEditPost)

export default adminRouter
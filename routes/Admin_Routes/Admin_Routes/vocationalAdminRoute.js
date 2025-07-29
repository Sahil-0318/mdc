import express from 'express'

const vocational_Admin_Route = express.Router()
import { adminAuth } from '../../../middlewares/adminMiddleware.js'
import { bcaAdmList, bcaAdm, bcaAdmPartList, excelDownload, studentDetail, studentEdit, studentEditPost } from '../../../controllers/Admin_Controllers/Admin_Controller/vocationalAdminController.js'

vocational_Admin_Route.get("/admin/bca-adm-list", adminAuth, bcaAdmList)

vocational_Admin_Route.get("/admin/bca-:courseSession", adminAuth, bcaAdm)

vocational_Admin_Route.get("/admin/bca-:courseSession/:coursePart", adminAuth, bcaAdmPartList)

vocational_Admin_Route.get("/admin/bca-:courseSession/:coursePart/excel", adminAuth, excelDownload)

vocational_Admin_Route.get("/admin/bca-:courseSession/part-:coursePart-student-detail/:studentId", adminAuth, studentDetail)

vocational_Admin_Route.get("/admin/bca-:courseSession/part-:coursePart-student-edit/:studentId", adminAuth, studentEdit)

vocational_Admin_Route.post("/admin/bca-:courseSession/part-:coursePart-student-edit/:studentId", adminAuth, studentEditPost)

export default vocational_Admin_Route
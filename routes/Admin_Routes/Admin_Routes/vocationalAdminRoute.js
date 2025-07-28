import express from 'express'

const vocational_Admin_Route = express.Router()
import { adminAuth } from '../../../middlewares/adminMiddleware.js'
import { bcaAdm, bcaAdmPartList, excelDownload, studentDetail } from '../../../controllers/Admin_Controllers/Admin_Controller/vocationalAdminController.js'

vocational_Admin_Route.get("/admin/bca-:courseSession", adminAuth, bcaAdm)

vocational_Admin_Route.get("/admin/bca-:courseSession/:coursePart", adminAuth, bcaAdmPartList)

vocational_Admin_Route.get("/admin/bca-:courseSession/:coursePart/excel", adminAuth, excelDownload)

vocational_Admin_Route.get("/admin/bca-:courseSession/student-detail/:studentId", adminAuth, studentDetail)

export default vocational_Admin_Route
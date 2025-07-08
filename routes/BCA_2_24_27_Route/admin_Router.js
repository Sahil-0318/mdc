import express from 'express'
const BCA_2_24_27_Admin_Router = express.Router()
import { adminAuth } from '../../middlewares/adminMiddleware.js'
import { admList, list, listPost, studentDetail, studentEdit, studentEditPost } from '../../controllers/BCA_2_24_27_Controller/admin_Controller.js'

BCA_2_24_27_Admin_Router.get('/bca-2-24-27-list', adminAuth, list)

BCA_2_24_27_Admin_Router.post('/bca-2-24-27-list', adminAuth, listPost)

BCA_2_24_27_Admin_Router.get('/bca-2-24-27-student-detail/:stuId', adminAuth, studentDetail)

BCA_2_24_27_Admin_Router.get('/bca-2-24-27-student-edit/:stuId', adminAuth, studentEdit)

BCA_2_24_27_Admin_Router.post('/bca-2-24-27-student-edit/:editId', adminAuth, studentEditPost)

BCA_2_24_27_Admin_Router.get('/bca-2-24-27-adm-list', adminAuth, admList)


export default BCA_2_24_27_Admin_Router
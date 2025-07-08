import express from 'express'
const BCA_3_23_26_Admin_Router = express.Router()
import { adminAuth } from '../../middlewares/adminMiddleware.js'
import { admList, list, listPost, studentDetail, studentEdit, studentEditPost } from '../../controllers/BCA_3_23_26_Controller/admin_Controller.js'

BCA_3_23_26_Admin_Router.get('/bca-3-23-26-list', adminAuth, list)

BCA_3_23_26_Admin_Router.post('/bca-3-23-26-list', adminAuth, listPost)

BCA_3_23_26_Admin_Router.get('/bca-3-23-26-student-detail/:stuId', adminAuth, studentDetail)

BCA_3_23_26_Admin_Router.get('/bca-3-23-26-student-edit/:stuId', adminAuth, studentEdit)

BCA_3_23_26_Admin_Router.post('/bca-3-23-26-student-edit/:editId', adminAuth, studentEditPost)

BCA_3_23_26_Admin_Router.get('/bca-3-23-26-adm-list', adminAuth, admList)


export default BCA_3_23_26_Admin_Router
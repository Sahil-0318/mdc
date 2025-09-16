import express from 'express'
const Ug_Reg_Sem_3_24_28_Admin_Router = express.Router()

import { adminAuth } from '../../middlewares/adminMiddleware.js'

import { ugRegSem3_24_28Password, ugRegSem3_24_28List, ugRegSem3_24_28StudentDetails, ugRegSem3_24_28EditStudentDetails, ugRegSem3_24_28EditStudentDetailsPost, ugRegSem3_24_28AllExcelsheet, ugRegSem3_24_28BAExcelsheet, ugRegSem3_24_28BScExcelsheet } from '../../controllers/Ug_Reg_Sem_3_24_28_Controller/admin_Controller.js'

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-password', adminAuth, ugRegSem3_24_28Password)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-list', adminAuth, ugRegSem3_24_28List)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-studentDetails/:stuId', adminAuth, ugRegSem3_24_28StudentDetails)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-editStudentDetails/:stuId', adminAuth, ugRegSem3_24_28EditStudentDetails)

Ug_Reg_Sem_3_24_28_Admin_Router.post('/ug-reg-sem-3-24-28-editStudentDetails/:stuId', adminAuth, ugRegSem3_24_28EditStudentDetailsPost)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-all-excelsheet', adminAuth, ugRegSem3_24_28AllExcelsheet)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-BA-excelsheet', adminAuth, ugRegSem3_24_28BAExcelsheet)

Ug_Reg_Sem_3_24_28_Admin_Router.get('/ug-reg-sem-3-24-28-BSc-excelsheet', adminAuth, ugRegSem3_24_28BScExcelsheet)

export default Ug_Reg_Sem_3_24_28_Admin_Router
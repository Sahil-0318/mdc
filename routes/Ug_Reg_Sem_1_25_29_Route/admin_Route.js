import express from 'express'
const Ug_Reg_Sem_1_25_29_Admin_Router = express.Router()
import jwt from 'jsonwebtoken'

import { adminAuth } from '../../middlewares/adminMiddleware.js'

import { ugRegSem1_25_29Password, ugRegSem1_25_29List, ugRegSem1_25_29StudentDetails, ugRegSem1_25_29EditStudentDetails, ugRegSem1_25_29EditStudentDetailsPost, ugRegSem1_25_29AllExcelsheet, ugRegSem1_25_29BAExcelsheet, ugRegSem1_25_29BScExcelsheet } from '../../controllers/Ug_Reg_Sem_1_25_29_Controller/admin_Controller.js'

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-password', adminAuth, ugRegSem1_25_29Password)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-list', adminAuth, ugRegSem1_25_29List)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-studentDetails/:stuId', adminAuth, ugRegSem1_25_29StudentDetails)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-editStudentDetails/:stuId', adminAuth, ugRegSem1_25_29EditStudentDetails)

Ug_Reg_Sem_1_25_29_Admin_Router.post('/ug-reg-sem-1-25-29-editStudentDetails/:stuId', adminAuth, ugRegSem1_25_29EditStudentDetailsPost)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-all-excelsheet', adminAuth, ugRegSem1_25_29AllExcelsheet)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-BA-excelsheet', adminAuth, ugRegSem1_25_29BAExcelsheet)

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-BSc-excelsheet', adminAuth, ugRegSem1_25_29BScExcelsheet)

export default Ug_Reg_Sem_1_25_29_Admin_Router
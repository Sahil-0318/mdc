import express from 'express'
const Ug_Reg_Sem_5_23_27_Admin_Router = express.Router()

import { adminAuth } from '../../middlewares/adminMiddleware.js'

import { ugRegSem5_23_27Password, ugRegSem5_23_27List, ugRegSem5_23_27StudentDetails, ugRegSem5_23_27EditStudentDetails, ugRegSem5_23_27EditStudentDetailsPost, ugRegSem5_23_27AllExcelsheet, ugRegSem5_23_27BAExcelsheet, ugRegSem5_23_27BScExcelsheet } from '../../controllers/Ug_Reg_Sem_5_23_27_Controller/admin_Controller.js'

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-password', adminAuth, ugRegSem5_23_27Password)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-list', adminAuth, ugRegSem5_23_27List)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-studentDetails/:stuId', adminAuth, ugRegSem5_23_27StudentDetails)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-editStudentDetails/:stuId', adminAuth, ugRegSem5_23_27EditStudentDetails)

Ug_Reg_Sem_5_23_27_Admin_Router.post('/ug-reg-sem-5-23-27-editStudentDetails/:stuId', adminAuth, ugRegSem5_23_27EditStudentDetailsPost)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-all-excelsheet', adminAuth, ugRegSem5_23_27AllExcelsheet)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-BA-excelsheet', adminAuth, ugRegSem5_23_27BAExcelsheet)

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-BSc-excelsheet', adminAuth, ugRegSem5_23_27BScExcelsheet)

export default Ug_Reg_Sem_5_23_27_Admin_Router
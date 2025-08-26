import express from 'express'
const Ug_Reg_Sem_5_23_27_Admin_Router = express.Router()

import { adminAuth } from '../../middlewares/adminMiddleware.js'

import { ugRegSem5_23_27Password } from '../../controllers/Ug_Reg_Sem_5_23_27_Controller/admin_Controller.js'

Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-password', adminAuth, ugRegSem5_23_27Password)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-list', adminAuth, ugRegSem1_25_29List)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-studentDetails/:stuId', adminAuth, ugRegSem1_25_29StudentDetails)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-editStudentDetails/:stuId', adminAuth, ugRegSem1_25_29EditStudentDetails)

// Ug_Reg_Sem_5_23_27_Admin_Router.post('/ug-reg-sem-5-23-27-editStudentDetails/:stuId', adminAuth, ugRegSem1_25_29EditStudentDetailsPost)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-all-excelsheet', adminAuth, ugRegSem1_25_29AllExcelsheet)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-BA-excelsheet', adminAuth, ugRegSem1_25_29BAExcelsheet)

// Ug_Reg_Sem_5_23_27_Admin_Router.get('/ug-reg-sem-5-23-27-BSc-excelsheet', adminAuth, ugRegSem1_25_29BScExcelsheet)

export default Ug_Reg_Sem_5_23_27_Admin_Router
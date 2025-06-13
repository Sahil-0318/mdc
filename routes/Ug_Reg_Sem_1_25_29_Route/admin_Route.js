import express from 'express'
const Ug_Reg_Sem_1_25_29_Admin_Router = express.Router()
import jwt from 'jsonwebtoken'

import { adminAuth } from '../../middlewares/adminMiddleware.js'

import { ugRegSem1_25_29Password } from '../../controllers/Ug_Reg_Sem_1_25_29_Controller/admin_Controller.js'

Ug_Reg_Sem_1_25_29_Admin_Router.get('/ug-reg-sem-1-25-29-password', adminAuth, ugRegSem1_25_29Password)

export default Ug_Reg_Sem_1_25_29_Admin_Router
import express from 'express'
const ug_Regular_Super_Admin_Route = express.Router()

import { uploadExcel } from '../../../middlewares/mediaMiddleware.js'

import { superAdminAuth } from '../../../middlewares/authMiddleware.js'

import { ugRegularAdmission_SA, ugRegularAdmissionPost_SA } from '../../../controllers/Admin_Controllers/Super_Admin_Controller/ugRegularSuperAdminController.js'


ug_Regular_Super_Admin_Route.get("/super-admin/ug-regular-admission", superAdminAuth, ugRegularAdmission_SA)

ug_Regular_Super_Admin_Route.post("/super-admin/ug-regular-admission-post", superAdminAuth, ugRegularAdmissionPost_SA)

export default ug_Regular_Super_Admin_Route
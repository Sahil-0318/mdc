import express from 'express'
import { uploadExcel } from '../../../middlewares/mediaMiddleware.js'

import { dashboard, bcaAdmission, bcaAdmissionPost, portalStatus, portalDetail, portalAdmStatus, updateMeritList, deletePortal } from '../../../controllers/Admin_Controllers/Super_Admin_Controller/vocationalSuperAdminController.js'

import { superAdminAuth } from '../../../middlewares/authMiddleware.js'
const vocational_Super_Admin_Route = express.Router()

vocational_Super_Admin_Route.get("/super-admin/dashboard", superAdminAuth, dashboard)

vocational_Super_Admin_Route.get("/super-admin/bcaAdmission", superAdminAuth, bcaAdmission)

vocational_Super_Admin_Route.post("/super-admin/bcaAdmissionPost", superAdminAuth, uploadExcel.single('meritListFile'), bcaAdmissionPost)

vocational_Super_Admin_Route.get("/:degree/:portalId", superAdminAuth, portalDetail)

vocational_Super_Admin_Route.get("/portalStatus/:degree/:part/:portalId", superAdminAuth, portalStatus)

vocational_Super_Admin_Route.get("/portalAdmStatus/:degree/:part/:portalId", superAdminAuth, portalAdmStatus)

vocational_Super_Admin_Route.post("/updateMeritList/:degree", superAdminAuth, uploadExcel.single('meritListFile'), updateMeritList)

vocational_Super_Admin_Route.get("/delete/:degree/:portalId", superAdminAuth, deletePortal)

export default vocational_Super_Admin_Route
import express from 'express'
const ug_Regular_Super_Admin_Route = express.Router()

import { uploadExcel } from '../../../middlewares/mediaMiddleware.js'

import { superAdminAuth } from '../../../middlewares/authMiddleware.js'

import { ugRegularAdmission_SA, ugRegularAdmissionPost_SA, updatePortalStatus, updateAdmPortalStatus, portalDetail, ugRegularUpdateMeritList_SA, ugRegularUpdateMeritListPost_SA, ugRegularDeletePortal_SA } from '../../../controllers/Admin_Controllers/Super_Admin_Controller/ugRegularSuperAdminController.js'


ug_Regular_Super_Admin_Route.get("/super-admin/ug-regular-admission", superAdminAuth, ugRegularAdmission_SA)

ug_Regular_Super_Admin_Route.post("/super-admin/ug-regular-admission-post", superAdminAuth, uploadExcel.single('meritListFile'), ugRegularAdmissionPost_SA)

ug_Regular_Super_Admin_Route.get("/super-admin/portalDetail/:portalId", superAdminAuth, portalDetail)

ug_Regular_Super_Admin_Route.get("/super-admin/updatePortalStatus/:sem/:portalId", superAdminAuth, updatePortalStatus)

ug_Regular_Super_Admin_Route.get("/super-admin/updateAdmPortalStatus/:sem/:portalId", superAdminAuth, updateAdmPortalStatus)

ug_Regular_Super_Admin_Route.get("/super-admin/ug-regular-admission/updateMeritList", superAdminAuth, ugRegularUpdateMeritList_SA)

ug_Regular_Super_Admin_Route.post("/super-admin/ug-regular-admission/updateMeritList", superAdminAuth, uploadExcel.single('meritListFile'), ugRegularUpdateMeritListPost_SA)

ug_Regular_Super_Admin_Route.get("/super-admin/ug-regular-admission/delete/:portalId", superAdminAuth, ugRegularDeletePortal_SA)

export default ug_Regular_Super_Admin_Route
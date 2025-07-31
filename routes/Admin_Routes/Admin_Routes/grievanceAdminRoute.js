import express from 'express'

const grievance_Admin_Route = express.Router()

import { adminAuth } from '../../../middlewares/adminMiddleware.js'

import { grievanceList, grievanceView, grievanceStatusChange } from '../../../controllers/Admin_Controllers/Admin_Controller/grievanceController.js'

grievance_Admin_Route.get("/admin/grievance-list", adminAuth, grievanceList)

grievance_Admin_Route.get("/grievance/view/:id", adminAuth, grievanceView);

grievance_Admin_Route.post("/grievance/status/:id", adminAuth, grievanceStatusChange)

export default grievance_Admin_Route
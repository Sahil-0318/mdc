import express from 'express'
const certificateAdminRouter = express.Router()
import { adminAuth } from '../../middlewares/adminMiddleware.js'

import {
    // Character Certificate
    cclist, downloadcc
} from "../../controllers/certificateController/certificateAdminController.js"

certificateAdminRouter.get("/cclist", adminAuth, cclist )
certificateAdminRouter.get("/cc/:id", adminAuth, downloadcc )


export default certificateAdminRouter
import express from 'express'
const certificateAdminRouter = express.Router()
import { adminAuth } from '../../middlewares/adminMiddleware.js'

import {
    // CLC
    clclist, downloadclc,
    // Character Certificate
    cclist, downloadcc,
    // TC
    tclist, downloadtc,
    // Bonafied
    bonafiedlist, downloadbonafied
} from "../../controllers/certificateController/certificateAdminController.js"

// Character certificate
certificateAdminRouter.get("/clcListAdmin", adminAuth, clclist )
certificateAdminRouter.get("/clcListAdmin/:id", adminAuth, downloadclc )

// Character certificate
certificateAdminRouter.get("/cclist", adminAuth, cclist )
certificateAdminRouter.get("/cc/:id", adminAuth, downloadcc )

// TC
certificateAdminRouter.get("/tclist", adminAuth, tclist )
certificateAdminRouter.get("/tc/:id", adminAuth, downloadtc )

// Bonafied
certificateAdminRouter.get("/bonafiedlist", adminAuth, bonafiedlist )
certificateAdminRouter.get("/bonafied/:id", adminAuth, downloadbonafied )


export default certificateAdminRouter
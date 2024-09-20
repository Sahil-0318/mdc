import express from "express"
const portalOnOffRouter = express.Router()
import { adminAuth } from '../middlewares/adminMiddleware.js'

import {ugRegularSem1Potal202428, ugRegularPart3Potal202225, ugRegularPart3Potal202327, bca1202427, bca3202225, bca2202326 } from "../controllers/portalOnOffController.js"

portalOnOffRouter.get("/ugRegularSem1Potal202428", adminAuth, ugRegularSem1Potal202428 )
portalOnOffRouter.get("/ugRegularPart3Potal202225", adminAuth, ugRegularPart3Potal202225 )
portalOnOffRouter.get("/ugRegularSem3Potal202327", adminAuth, ugRegularPart3Potal202327 )
portalOnOffRouter.get("/bca1202427", adminAuth, bca1202427 )
portalOnOffRouter.get("/bca3202225", adminAuth, bca3202225 )
portalOnOffRouter.get("/bca2202326", adminAuth, bca2202326 )

export default portalOnOffRouter
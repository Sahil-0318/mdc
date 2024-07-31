import express from "express"
const portalOnOffRouter = express.Router()
import { adminAuth } from '../middlewares/adminMiddleware.js'

import {ugRegularSem1Potal202428, ugRegularPart3Potal202225, ugRegularPart3Potal202327} from "../controllers/portalOnOffController.js"

portalOnOffRouter.get("/ugRegularSem1Potal202428", adminAuth, ugRegularSem1Potal202428 )
portalOnOffRouter.get("/ugRegularPart3Potal202225", adminAuth, ugRegularPart3Potal202225 )
portalOnOffRouter.get("/ugRegularSem3Potal202327", adminAuth, ugRegularPart3Potal202327 )

export default portalOnOffRouter
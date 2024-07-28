import express from "express"
const portalOnOffRouter = express.Router()
import { adminAuth } from '../middlewares/adminMiddleware.js'

import {ugRegularPart3Potal202225, ugRegularPart3Potal202225Post} from "../controllers/portalOnOffController.js"

portalOnOffRouter.get("/ugRegularPart3Potal202225", adminAuth, ugRegularPart3Potal202225 )
portalOnOffRouter.post("/ugRegularPart3Potal202225", adminAuth, ugRegularPart3Potal202225Post )

export default portalOnOffRouter
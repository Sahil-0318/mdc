import express from 'express'
const apiRouter = express.Router()

import { noticeAPI, grievancesAPI } from '../controllers/apiController.js'

apiRouter.get("/notices", noticeAPI)
apiRouter.post("/grievances", grievancesAPI)

export default apiRouter
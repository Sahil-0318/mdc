import express from 'express'
const apiRouter = express.Router()

import { noticeAPI, grievancesAPI, imageGalleryAPI } from '../controllers/apiController.js'

apiRouter.get("/notices", noticeAPI)
apiRouter.post("/grievances", grievancesAPI)
apiRouter.get("/image-gallery", imageGalleryAPI)

export default apiRouter
import express from 'express'
const recordRoomRouter = express.Router()
import {recordRoomAuth} from '../middlewares/recordRoomMiddleware.js'

import { 
    recordRoomPage
 } 
 from '../controllers/recordRoomController.js'

 recordRoomRouter.get('/recordRoomPage', recordRoomAuth, recordRoomPage)



export default recordRoomRouter
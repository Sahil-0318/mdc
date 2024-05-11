import express from 'express'
const recordRoomRouter = express.Router()
import {recordRoomAuth} from '../middlewares/recordRoomMiddleware.js'

import { 
    recordRoomPage,
    interClcApprovedList,
    baClcApprovedList,
    bcomClcApprovedList,
    bcsClcApprovedList
 } 
 from '../controllers/recordRoomController.js'

 recordRoomRouter.get('/recordRoomPage', recordRoomAuth, recordRoomPage)

 recordRoomRouter.get('/interClcApprovedList', recordRoomAuth, interClcApprovedList)

 recordRoomRouter.get('/baClcApprovedList', recordRoomAuth, baClcApprovedList)

 recordRoomRouter.get('/bcomClcApprovedList', recordRoomAuth, bcomClcApprovedList)

 recordRoomRouter.get('/bcsClcApprovedList', recordRoomAuth, bcsClcApprovedList)



export default recordRoomRouter
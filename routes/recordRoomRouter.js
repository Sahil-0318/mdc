import express from 'express'
const recordRoomRouter = express.Router()
import {recordRoomAuth} from '../middlewares/recordRoomMiddleware.js'

import { 
    recordRoomPage,
    interClcApprovedList,
    baClcApprovedList,
    bcomClcApprovedList,
    bscClcApprovedList,
    bcaClcApprovedList,
    printCertificate
 } 
 from '../controllers/recordRoomController.js'

 recordRoomRouter.get('/recordRoomPage', recordRoomAuth, recordRoomPage)

 recordRoomRouter.get('/interClcApprovedList', recordRoomAuth, interClcApprovedList)

 recordRoomRouter.get('/baClcApprovedList', recordRoomAuth, baClcApprovedList)

 recordRoomRouter.get('/bcomClcApprovedList', recordRoomAuth, bcomClcApprovedList)

 recordRoomRouter.get('/bscClcApprovedList', recordRoomAuth, bscClcApprovedList)

 recordRoomRouter.get('/bcaClcApprovedList', recordRoomAuth, bcaClcApprovedList)

 recordRoomRouter.get('/download/:certificate/:course/:id', recordRoomAuth, printCertificate)



export default recordRoomRouter
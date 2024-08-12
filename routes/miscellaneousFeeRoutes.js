import express from 'express'
import { userAuth } from '../middlewares/userMiddleware.js'
import { 
    // Marksheet
    marksheet
 } from '../controllers/miscellaneousFeeController.js'
const miscellaneousFeeRouter = express.Router()
import multer from 'multer'


const upload = multer({
    storage: multer.memoryStorage()
})

// marksheet
miscellaneousFeeRouter.get('/miscellaneousFee/marksheet', userAuth, marksheet)


export default miscellaneousFeeRouter
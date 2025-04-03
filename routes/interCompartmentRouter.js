import express from 'express'
const interCopmpartmentRouter = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import { signup, signupPost, login, loginPost, logout, interCompartmentalExamForm, interCompartmentalExamFormPost, interExamForm2Pay, interExamForm2PayPost, interExamForm2Receipt, interExamForm2Copy } from '../controllers/interCompartmentController.js'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/interCompartmentalExamFormLogin')
    }
}
  
const upload = multer({
    storage: multer.memoryStorage()
})

interCopmpartmentRouter.get('/interCompartmentalExamFormSignup', signup)
interCopmpartmentRouter.post('/interCompartmentalExamFormSignup', signupPost)

interCopmpartmentRouter.get('/interCompartmentalExamFormLogin', login)
interCopmpartmentRouter.post('/interCompartmentalExamFormLogin', loginPost)

interCopmpartmentRouter.get('/interCompartmentalLogout', logout)

interCopmpartmentRouter.get('/interCompartmentalExamForm', userAuth, interCompartmentalExamForm)
interCopmpartmentRouter.post('/interCompartmentalExamForm', userAuth, upload.array('studentPhoto'), interCompartmentalExamFormPost)

interCopmpartmentRouter.get('/interExamForm2Pay', userAuth, interExamForm2Pay)
interCopmpartmentRouter.post('/interExamForm2Pay', userAuth, upload.single('paymentSS'), interExamForm2PayPost)

interCopmpartmentRouter.get('/interExamForm2Receipt', userAuth, interExamForm2Receipt)
interCopmpartmentRouter.get('/interExamForm2Copy', userAuth, interExamForm2Copy)


export default interCopmpartmentRouter
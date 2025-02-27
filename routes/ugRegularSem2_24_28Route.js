import express from "express";
const ugRegularSem2_24_28Router = express.Router();
import jwt from "jsonwebtoken";
import multer from 'multer'

import { signup, signupPost, login, loginPost, logout, admissionForm, admissionFormPost, ugRegularSem2_24_28Pay, ugRegularSem2_24_28payPost, ugRegularSem2_24_28Receipt, admFormCopy } from "../controllers/ugRegularSem2_24_28Controller.js";

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        res.status(401).redirect('/ugRegularSem2_24_28_Login')
    }
}

const storage = multer.diskStorage({})
  
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_Signup', signup)
ugRegularSem2_24_28Router.post('/ugRegularSem2_24_28_Signup', signupPost)

ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_Login', login)
ugRegularSem2_24_28Router.post('/ugRegularSem2_24_28_Login', loginPost)

ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_Logout', logout)

ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_AdmissionForm', userAuth, admissionForm)
ugRegularSem2_24_28Router.post('/ugRegularSem2_24_28_AdmissionForm', userAuth, upload.array('studentPhoto'), admissionFormPost)

ugRegularSem2_24_28Router.get('/ugRegularSem_2_24_28_Pay', userAuth, ugRegularSem2_24_28Pay)
ugRegularSem2_24_28Router.post('/ugRegularSem_2_24_28_Pay', userAuth, upload.single('paymentSS'), ugRegularSem2_24_28payPost)

ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_Receipt', userAuth, ugRegularSem2_24_28Receipt)
ugRegularSem2_24_28Router.get('/ugRegularSem2_24_28_AdmFormCopy', userAuth, admFormCopy)

export default ugRegularSem2_24_28Router
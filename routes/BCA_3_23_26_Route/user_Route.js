import express from 'express'
const BCA_3_23_26_Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import { signup, signupPost, login, loginPost, logout, admForm, admFormPost, downloadAdmFormPdf, downloadReceiptPdf } from '../../controllers/BCA_3_23_26_Controller/user_Controller.js'

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()

    } catch (error) {
        req.flash("flashMessage", ["Login to access this page", "alert-danger"]);
        res.status(401).redirect('/bca-3-23-26-login')
    }
}


const upload = multer({
    storage: multer.memoryStorage()
})

BCA_3_23_26_Router.get("/bca-3-23-26-signup", signup)
BCA_3_23_26_Router.post("/bca-3-23-26-signup", signupPost)

BCA_3_23_26_Router.get("/bca-3-23-26-login", login)
BCA_3_23_26_Router.post("/bca-3-23-26-login", loginPost)

BCA_3_23_26_Router.get('/bca-3-23-26-logout', logout)

BCA_3_23_26_Router.get("/bca-3-23-26-adm-form", userAuth, admForm)
BCA_3_23_26_Router.post("/bca-3-23-26-adm-form", userAuth, upload.array('studentPhoto'), admFormPost)

BCA_3_23_26_Router.get('/bca-3-23-26-download-adm-form-pdf', userAuth, downloadAdmFormPdf)
BCA_3_23_26_Router.get('/bca-3-23-26-download-receipt-pdf', userAuth, downloadReceiptPdf)


export default BCA_3_23_26_Router
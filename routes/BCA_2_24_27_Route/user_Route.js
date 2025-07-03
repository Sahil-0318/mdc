import express from 'express'
const BCA_2_24_27_Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

import { signup, signupPost, login, loginPost, logout, admForm, admFormPost, downloadAdmFormPdf, downloadReceiptPdf } from '../../controllers/BCA_2_24_27_Controller/user_Controller.js'

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()

    } catch (error) {
        req.flash("flashMessage", ["Login to access this page", "alert-danger"]);
        res.status(401).redirect('/bca-2-24-27-login')
    }
}


const upload = multer({
    storage: multer.memoryStorage()
})

BCA_2_24_27_Router.get("/bca-2-24-27-signup", signup)
BCA_2_24_27_Router.post("/bca-2-24-27-signup", signupPost)

BCA_2_24_27_Router.get("/bca-2-24-27-login", login)
BCA_2_24_27_Router.post("/bca-2-24-27-login", loginPost)

BCA_2_24_27_Router.get('/bca-2-24-27-logout', logout)

BCA_2_24_27_Router.get("/bca-2-24-27-adm-form", userAuth, admForm)
BCA_2_24_27_Router.post("/bca-2-24-27-adm-form", userAuth, upload.array('studentPhoto'), admFormPost)

BCA_2_24_27_Router.get('/bca-2-24-27-download-adm-form-pdf', userAuth, downloadAdmFormPdf)
BCA_2_24_27_Router.get('/bca-2-24-27-download-receipt-pdf', userAuth, downloadReceiptPdf)


export default BCA_2_24_27_Router
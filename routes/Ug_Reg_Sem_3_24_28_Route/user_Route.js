import express from 'express'
const Ug_Reg_Sem_3_24_28_Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        req.id = verifiedUser.id
        next()

    } catch (error) {
        req.flash("flashMessage", ["Login to access this page", "alert-danger"]);
        res.status(401).redirect('/ug-reg-sem-3-24-28-login')
    }
}

const storage = multer.diskStorage({})

const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

import { register, registerPost, login, loginPost, logout, admForm, admFormPost, checkoutPage, payGet, payPost, paymentSuccess, downloadAdmFormPdf, downloadReceiptPdf } from '../../controllers/Ug_Reg_Sem_3_24_28_Controller/user_Controller.js'

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-register', register)
Ug_Reg_Sem_3_24_28_Router.post('/ug-reg-sem-3-24-28-register', registerPost)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-login', login)
Ug_Reg_Sem_3_24_28_Router.post('/ug-reg-sem-3-24-28-login', loginPost)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-logout', logout)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-adm-form', userAuth, admForm)
Ug_Reg_Sem_3_24_28_Router.post('/ug-reg-sem-3-24-28-adm-form', upload.array('studentPhoto'), userAuth, admFormPost)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28/payment/checkout', userAuth, checkoutPage)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-payment-pay', userAuth, payGet)

Ug_Reg_Sem_3_24_28_Router.post('/ug-reg-sem-3-24-28-payment-pay', upload.array('paymentSS'), userAuth, payPost)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28/payment/payment-success', userAuth, paymentSuccess)

Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-download-adm-form-pdf', userAuth, downloadAdmFormPdf)
Ug_Reg_Sem_3_24_28_Router.get('/ug-reg-sem-3-24-28-download-receipt-pdf', userAuth, downloadReceiptPdf)

export default Ug_Reg_Sem_3_24_28_Router
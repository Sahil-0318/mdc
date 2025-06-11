import express from 'express'
const Ug_Reg_Sem_1_25_29_Payment_Router = express.Router()
import jwt from 'jsonwebtoken'
import multer from 'multer'

const userAuth = async (req, res , next)=>{
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        req.id = verifiedUser.id
        next()
        
    } catch (error) {
        req.flash("flashMessage", ["Login to access this page", "alert-danger"]);
        res.status(401).redirect('/ug-reg-sem-1-25-29-login')
    }
}

const storage = multer.diskStorage({})
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

import { checkoutPage, payGet, payPost, pay, payResponse, paymentSuccess } from '../../controllers/Ug_Reg_Sem_1_25_29_Controller/payment_Controller.js'

Ug_Reg_Sem_1_25_29_Payment_Router.get('/ug-reg-sem-1-25-29/payment/checkout', userAuth, checkoutPage)

// This is new route for backup payment
Ug_Reg_Sem_1_25_29_Payment_Router.get('/ug-reg-sem-1-25-29-payment-pay', userAuth, payGet)

Ug_Reg_Sem_1_25_29_Payment_Router.post('/ug-reg-sem-1-25-29-payment-pay', upload.array('paymentSS'), userAuth, payPost)

// ===================================

Ug_Reg_Sem_1_25_29_Payment_Router.post('/ug-reg-sem-1-25-29/payment/pay', userAuth, pay)

Ug_Reg_Sem_1_25_29_Payment_Router.post('/ug-reg-sem-1-25-29/payment/payResponse', userAuth, payResponse)

Ug_Reg_Sem_1_25_29_Payment_Router.get('/ug-reg-sem-1-25-29/payment/payment-success', userAuth, paymentSuccess)

export default Ug_Reg_Sem_1_25_29_Payment_Router
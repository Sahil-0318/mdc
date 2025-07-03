import express from 'express'
const BCA_2_24_27_Payment_Router = express.Router()
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
        res.status(401).redirect('/bca-2-24-27-login')
    }
}

const storage = multer.diskStorage({})
const upload = multer({
    storage: storage
    // limits: {fileSize: 100000}
})

import { checkoutPage, payGet, payPost, paymentSuccess } from '../../controllers/BCA_2_24_27_Controller/payment_Controller.js'

BCA_2_24_27_Payment_Router.get('/bca-2-24-27/payment/checkout', userAuth, checkoutPage)

BCA_2_24_27_Payment_Router.get('/bca-2-24-27-payment-pay', userAuth, payGet)

BCA_2_24_27_Payment_Router.post('/bca-2-24-27-payment-pay', upload.array('paymentSS'), userAuth, payPost)

BCA_2_24_27_Payment_Router.get('/bca-2-24-27/payment/payment-success', userAuth, paymentSuccess)

export default BCA_2_24_27_Payment_Router
const PHONE_PAY_HOST_URL = process.env.PHONE_PAY_HOST_URL
const MERCHANT_ID = process.env.MERCHANT_ID
const SALT_INDEX = process.env.SALT_INDEX
const SALT_KEY = process.env.SALT_KEY
import axios from 'axios'
import uniqid from 'uniqid'
import sha256 from 'sha256'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import User from '../models/userModel/userSchema.js'
import FileUpload from '../fileUpload/fileUpload.js'




const payment = (req, res) => {
    let payAmount = 1000
    console.log(req.body)
    // res.send('Phone Pay works')
    const payEndpoint = "/pg/v1/pay"

    let merchantTransactionId = uniqid()
    let merchantUserId = 123

    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": merchantUserId,
        "amount": payAmount,
        "redirectUrl": `http://localhost:5001/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        // "callbackUrl": "https://webhook.site/callback-url",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    const bufferObj = Buffer.from(JSON.stringify(payload, "utf8"))
    const Base64EncodedPayload = bufferObj.toString("base64")
    const xVerify = sha256(Base64EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX

    const options = {
        method: 'post',
        url: `${PHONE_PAY_HOST_URL}${payEndpoint}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            "X-VERIFY": xVerify
        },
        data: {
            request: Base64EncodedPayload
        }
    };
    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            const url = response.data.data.instrumentResponse.redirectInfo.url
            // res.send(response.data)
            // res.send(url)
            res.redirect(url)
        })
        .catch(function (error) {
            console.error("Payment error", error);
        });
}

const paymentInvoice = (req, res) => {
    const { merchantTransactionId } = req.params
    console.log('merchantTransactionId', merchantTransactionId);
    if (merchantTransactionId) {
        const xVerify = sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) + "###" + SALT_INDEX
        const options = {
            method: 'get',
            url: `${PHONE_PAY_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                "X-MERCHANT-ID": merchantTransactionId,
                "X-VERIFY": xVerify
            },

        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if (response.data.code === 'PAYMENT_SUCCESS') {
                    //redirect user to success page
                } else if (response.data.code === 'ERROR') {
                    //redirect user to error page   
                } else {
                    //redirect to pending
                }
                res.send(response.data)
            })
            .catch(function (error) {
                console.error(error);
            });

        res.send(merchantTransactionId)
    } else {
        res.send(error, 'Error')

    }

}

let fee = 0
const refNoPost = async (req, res) => {
    const { refNo } = req.body
    console.log("ref No. ",refNo);

    const user = await User.findOne({ _id: req.id })
    // console.log(user);

    const photoUpload = await FileUpload(req.file.path)
    const paymentSSURL = photoUpload.secure_url
    // console.log(paymentSSURL);

    await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })
    await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { refNo: refNo } })
    // console.log(appledUser);
    const appliedUser = await AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: "true" } })
    // console.log(appliedUser);
    // if (appliedUser.gender === "Female") {
    //     fee=100
    // } else if (appliedUser.category === "General") {
    //     fee=150
    // } else if (appliedUser.category === "SC" || appliedUser.category ==="ST") {
    //     fee=100
    // } else {
    //     fee=120
    // }
    if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
        fee = 3000
    } else {
        fee = 2830
    }
    return res.render('slip', { user, appliedUser, "fee": fee })

}

const getSlipPost = async (req, res) => {
    const user = await User.findOne({ _id: req.id })
    const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
    // if (appliedUser.gender === "Female") {
    //     fee=100
    // } else if (appliedUser.category === "General") {
    //     fee=150
    // } else if (appliedUser.category === "SC" || appliedUser.category ==="ST") {
    //     fee=100
    // } else {
    //     fee=120
    // }
    if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
        fee = 3000
    } else {
        fee = 2830
    }
    return res.render('slip', { user, appliedUser, "fee": fee })
}


export {
    payment,
    paymentInvoice,
    refNoPost,
    getSlipPost
}
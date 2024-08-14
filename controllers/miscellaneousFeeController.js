import User from '../models/userModel/userSchema.js'
import MiscellaneousFee from '../models/userModel/miscellaneousFeeSchema.js'

import FileUpload from '../fileUpload/fileUpload.js'
import qrcode from 'qrcode'


// ===================================== Marksheet ==================================================================================
export const marksheet = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })

        let extraInfo = {}

        if (appliedUser != null) {
            extraInfo.isPaid = appliedUser.isMarksheetPaid
            extraInfo.printURL = "marksheet"

            return res.render('miscellaneousFeeForm', { user, title: "Marksheet", appliedUser, extraInfo })
        }
        return res.render('miscellaneousFeeForm', { user, title: "Marksheet", formType: "marksheet" })
    } catch (error) {
        console.log("Error in marksheet get method", error)
    }
}


// ===================================== Original Passing Certificate(Inter) =========================================================
export const opci = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })

        let extraInfo = {}

        if (appliedUser != null) {
            extraInfo.isPaid = appliedUser.isOpciPaid
            extraInfo.printURL = "opci"

            return res.render('miscellaneousFeeForm', { user, title: "Original Passing Certificate (Inter)", appliedUser, extraInfo })
        }
        return res.render('miscellaneousFeeForm', { user, title: "Original Passing Certificate (Inter)", formType: "opci" })
    } catch (error) {
        console.log("Error in opci get method", error)
    }
}


// ===================================== Forwading (Degree/Migration) ================================================================
export const fdm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('miscellaneousFeeForm', { user, title: "Forwading (Degree/Migration)", appliedUser })
        }
        return res.render('miscellaneousFeeForm', { user, title: "Forwading (Degree/Migration)", formType: "fdm" })
    } catch (error) {
        console.log("Error in fdm get method", error)
    }
}


// ===================================== Registration Forwading =======================================================================
export const rf = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('miscellaneousFeeForm', { user, title: "Registration Forwading", appliedUser })
        }
        return res.render('miscellaneousFeeForm', { user, title: "Registration Forwading", formType: "rf" })
    } catch (error) {
        console.log("Error in rf get method", error)
    }
}


// ===================================== Document Verification (Private) ===============================================================
export const dvp = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            return res.render('miscellaneousFeeForm', { user, title: "Document Verification (Private)", appliedUser })
        }
        return res.render('miscellaneousFeeForm', { user, title: "Document Verification (Private)", formType: "dvp" })
    } catch (error) {
        console.log("Error in marksheet get method", error)
    }
}


// ===================================== Miscellaneous Form Post ===============================================================
export const miscellaneousFormPost = async (req, res) => {
    let { formType } = req.params
    console.log("Miscellaneous Form Post", formType)
    const { fullName, collegeRollNumber, uniRegNumber, mobileNumber, courseName } = req.body
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })

        if (appliedUser === null) {
            let newMiscellaneousFeeForm = new MiscellaneousFee({
                fullName: fullName.trim(), collegeRollNumber: collegeRollNumber.trim(), uniRegNumber: uniRegNumber.trim(), mobileNumber, courseName, isFormFilled: true, appliedBy: user._id
            })
            await newMiscellaneousFeeForm.save()
            return res.redirect(`/miscellaneousFeePayment/${formType}`);
        }


    } catch (error) {
        console.log("Error in Miscellaneous Form Post method", error)
    }
}


// ===================================== Miscellaneous Fee Payment ===============================================================
export const miscellaneousFeePayment = async (req, res) => {
    let { formType } = req.params
    console.log("In miscellaneousFeePayment", formType)
    try {
        const user = await User.findOne({ _id: req.id })
        let appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        let extraInfo = {}

        if (formType === "marksheet") {

            // extra info
            extraInfo.title = "Marksheet"
            extraInfo.postURL = "marksheet"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then Marksheet receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Marksheet रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
            extraInfo.feeAmount = appliedUser.marksheetFeeAmount
        }

        if (formType === "opci") {

            // extra info
            extraInfo.title = "Original Passing Certificate (Inter)"
            extraInfo.postURL = "opci"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then Marksheet receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Marksheet रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
            extraInfo.feeAmount = appliedUser.opciFeeAmount
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(extraInfo.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
            res.status(201).render('miscellaneousFeePayment', { "qrcodeUrl": src, user, appliedUser, extraInfo })
        })



    } catch (error) {
        console.log("Error in Miscellaneous Fee Payment method", error)
    }
}


// =================================== Miscellaneous Fee Payment Post =============================================================
export const miscellaneousFeePaymentPost = async (req, res) => {
    try {
        const { refNo, formType } = req.body
        console.log("miscellaneousFeePaymentPost", formType, refNo)
        const user = await User.findOne({ _id: req.id })
        let appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })

        let extraInfo = {}
        let existPaymentId = ""

        //**************************************************************************************************
        if (formType === "marksheet") {
            existPaymentId = await MiscellaneousFee.findOne({ marksheetPaymentRefNo: refNo })

            // extra info
            extraInfo.title = "Marksheet"
            extraInfo.postURL = "marksheet"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then marksheet receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो marksheet रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
            extraInfo.feeAmount = appliedUser.marksheetFeeAmount
        }

        if (formType === "opci") {
            existPaymentId = await MiscellaneousFee.findOne({ opciPaymentRefNo: refNo })

            // extra info
            extraInfo.title = "Original Passing Certificate (Inter)"
            extraInfo.postURL = "opci"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then Original Passing Certificate (Inter) receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Original Passing Certificate (Inter) रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
            extraInfo.feeAmount = appliedUser.opciFeeAmount
        }

        if (existPaymentId === null) {
            const photoUpload = await FileUpload(req.file.buffer)
            const paymentSS = photoUpload.secure_url

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const paidAt = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

            if (formType === "marksheet") {
                await MiscellaneousFee.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { marksheetPaymentSS: paymentSS, marksheetPaymentDate: paidAt, marksheetPaymentRefNo: refNo, isMarksheetPaid: true, marksheetReceiptNo: `MDC-${Date.now()}` } })

            }

            if (formType === "opci") {
                await MiscellaneousFee.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { opciPaymentSS: paymentSS, opciPaymentDate: paidAt, opciPaymentRefNo: refNo, isOpciPaid: true, opciReceiptNo: `MDC-${Date.now()}` } })

            }

            // await MiscellaneousFee.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS, paidAt, paymentRefNo:refNo, isPaid:true, paymentReceipt : `MDC-${Date.now()}`} })

            res.redirect(`/miscellaneousReceipt/${formType.toLowerCase()}`)

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(extraInfo.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
                res.status(201).render('miscellaneousFeePayment', { "qrcodeUrl": src, user, appliedUser, extraInfo, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })


            // if (formType === "opci") {
            //     qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.marksheetFeeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
            //         res.status(201).render('miscellaneousFeePayment', { "qrcodeUrl": src, user, appliedUser, extraInfo, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            //     })
            // }

        }



    } catch (error) {
        console.log("Error in Miscellaneous Fee Payment Post method", error)
    }
}


// =================================== Miscellaneous Receipt ====================================================
export const miscellaneousReceipt = async (req, res) => {
    try {
        const { formType } = req.params
        console.log("Miscellaneous Receipt", formType)
        const user = await User.findOne({ _id: req.id })
        let appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        let extraInfo = {}

        if (formType === "marksheet") {

            // extra Info
            extraInfo.formType = "Marksheet"
            extraInfo.paymentReceipt = appliedUser.marksheetReceiptNo
            extraInfo.feeAmount = appliedUser.marksheetFeeAmount
            extraInfo.paidAt = appliedUser.marksheetPaymentDate
            extraInfo.paymentRefNo = appliedUser.marksheetPaymentRefNo

            if (!appliedUser.isMarksheetPaid) {
                res.redirect("/miscellaneousFee/marksheet")
            }
        }

        if (formType === "opci") {

            // extra Info
            extraInfo.formType = "Original Passing Certificate (Inter)"
            extraInfo.paymentReceipt = appliedUser.opciReceiptNo
            extraInfo.feeAmount = appliedUser.opciFeeAmount
            extraInfo.paidAt = appliedUser.opciPaymentDate
            extraInfo.paymentRefNo = appliedUser.opciPaymentRefNo

            if (!appliedUser.isOpciPaid) {
                res.redirect("/miscellaneousFee/original-passing-certificate-inter")
            }
        }

        res.render("miscellaneousReceipt", { appliedUser, user, extraInfo })

    } catch (error) {
        console.log("Error in Miscellaneous Receipt => ", error)
    }
}
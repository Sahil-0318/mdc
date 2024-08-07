import User from '../../models/userModel/userSchema.js'
import Bonafied from '../../models/certificateModels/bonafied.js'
import FileUpload from '../../fileUpload/fileUpload.js'
import qrcode from 'qrcode'

export const bonafiedForm = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null){
            return res.render('bonafiedForm', { user, appliedUser })
        }
        return res.render('bonafiedForm', { user })
    } catch (error) {
        console.log("Error in bonafiedForm => ", error)
    }
}

export const bonafiedFormPost = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const {fullName, sonDaughter, fatherName, motherName, collegeRollNumber, uniRegNumber, mobileNumber, email, course, courseName, honoursName, partSem, partSemName, courseSession, gender } = req.body

        const appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
        const appliedUniRegNumber = await Bonafied.findOne({ uniRegNumber })

        if (appliedUniRegNumber === null){
            const images = req.files
            let marksheetPhoto = ""
            let studentPhoto = ""
            let lastAdmissionReceipt = ""


            if (images.length == 3) {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url
                
                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url
                
                const lastAdmissionReceiptUpload = await FileUpload(images[2].buffer)
                lastAdmissionReceipt = lastAdmissionReceiptUpload.secure_url
            } else {
                const marksheetPhotoUpload = await FileUpload(images[0].buffer)
                marksheetPhoto = marksheetPhotoUpload.secure_url
                
                const studentPhotoUpload = await FileUpload(images[1].buffer)
                studentPhoto = studentPhotoUpload.secure_url
            }
            
            const newBonafiedForm  = new Bonafied ({
                fullName, sonDaughter, fatherName, motherName, collegeRollNumber, uniRegNumber, mobileNumber, email, course, courseName, honoursName, partSem, partSemName, courseSession, gender, marksheetPhoto, studentPhoto, lastAdmissionReceipt, appliedBy: user._id
            })
            
            await newBonafiedForm.save()
            res.redirect("/certificateFee/bonafied")
        }
        
    } catch (error) {
        console.log("Error in bonafiedFormPost => ", error)
    }
}

export const certificateFeePay = async (req, res) =>{
    try {
        const {certificateType} = req.params
        
        const user = await User.findOne({ _id: req.id })
        let appliedUser = ""
        let extraInfo = {}

        if (certificateType === "bonafied" ) {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "Bonafied"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then bonafied receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Bonafied रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }
        
        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
            res.status(201).render('certificatePaymentPage', { "qrcodeUrl": src, user, appliedUser, extraInfo })
        })

    } catch (error) {
        console.log("Error in certificateFeePay => ", error)
    }
}

export const certificateFeePayPost = async (req, res) =>{
    try {
        const { refNo, certificateType } = req.body
        const user = await User.findOne({ _id: req.id })

        let extraInfo = {}
        let appliedUser = ""
        let existPaymentId = ""
        let certificateSchema = ""

        if (certificateType === "Bonafied") {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await Bonafied.findOne({ paymentRefNo: refNo })

            certificateSchema = Bonafied
            // extra info
            extraInfo.title = "Bonafied"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then bonafied receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Bonafied रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
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

            await certificateSchema.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS, paidAt, paymentRefNo:refNo, isPaid:true, paymentReceipt : `MDC-${Date.now()}`} })

            res.redirect(`/certificateReceipt/${certificateType.toLowerCase()}`)

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.feeAmount)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('certificatePaymentPage', { "qrcodeUrl": src, user, appliedUser, extraInfo, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }

        

    } catch (error) {
        console.log("Error in certificateFeePayPost => ", error)
    }
}

export const certificateReceipt = async (req, res) =>{
    try {
        const {certificateType} = req.params
        const user = await User.findOne({ _id: req.id })
        let appliedUser = ""
        let extraInfo = {}

        if (certificateType === "bonafied") {
            appliedUser = await Bonafied.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "Bonafied"
        }

        if (!appliedUser.isPaid){
            res.redirect("/bonafied")
        }

        res.render("certificateReceipt", { appliedUser, user, extraInfo })

    } catch (error) {
        console.log("Error in certificateFeePayPost => ", error)
    }
}
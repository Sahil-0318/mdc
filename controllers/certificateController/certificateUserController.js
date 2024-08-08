import User from '../../models/userModel/userSchema.js'
import Bonafied from '../../models/certificateModels/bonafied.js'
import TC from '../../models/certificateModels/tc.js'
import CC from '../../models/certificateModels/cc.js'


import FileUpload from '../../fileUpload/fileUpload.js'
import qrcode from 'qrcode'

// ========================= Bonafied ===================================
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

// ================================ TC ======================================
export const tcForm = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null){
            return res.render('tcForm', { user, appliedUser })
        }
        return res.render('tcForm', { user })
    } catch (error) {
        console.log("Error in TCForm => ", error)
    }
}

export const tcFormPost = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const {fullName,fatherName, motherName, aadharNumber, mobileNumber, email, dOB, session, course, courseName, honoursName, collegeClass, lastPassedClass, collegeRollNumber, collegeFrom, collegeTo } = req.body

        const appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
        const appliedCollegeRollNumber = await TC.findOne({ collegeRollNumber })

        if (appliedCollegeRollNumber === null){
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
            
            const newTCForm  = new TC ({
                fullName, fatherName, motherName, aadharNumber, mobileNumber, email, dOB, session, course, courseName, honoursName, collegeClass, lastPassedClass, collegeRollNumber, collegeFrom, collegeTo, marksheetPhoto, studentPhoto, lastAdmissionReceipt, appliedBy: user._id
            })
            
            await newTCForm.save()
            res.redirect("/certificateFee/tc")
        }
        
    } catch (error) {
        console.log("Error in TCFormPost => ", error)
    }
}

// ====================== Character Certificate ================================
export const ccForm = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null){
            return res.render('cc', { user, appliedUser })
        }
        return res.render('cc', { user })
    } catch (error) {
        console.log("Error in cc Form => ", error)
    }
}

export const ccFormPost = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const { fullName,fatherName, motherName, courseName, session, collegeRollNumber } = req.body

        const appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
        const appliedCollegeRollNumber = await CC.findOne({ collegeRollNumber })

        if (appliedCollegeRollNumber === null){
            function generateRandom4DigitNumber() {
                return Math.floor(1000 + Math.random() * 9000);
            }

            const characterCertificateCount = await CC.countDocuments()
            let serialNo = characterCertificateCount + 1
            
            const newCCForm  = new CC({
                fullName, fatherName, motherName, courseName, session,collegeRollNumber, appliedBy: user._id, serialNo, studentId : `MDC-${generateRandom4DigitNumber()}${collegeRollNumber}`
            })
            
            await newCCForm.save()
            res.redirect("/certificateFee/cc")
        }
        
    } catch (error) {
        console.log("Error in cc Form Post => ", error)
    }
}

// Certificate Payment 
export const certificateFeePay = async (req, res) =>{
    try {
        const {certificateType} = req.params
        // console.log("certificateFeePay",certificateType)
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

        if (certificateType === "tc" ) {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "TC"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then TC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो TC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "cc" ) {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })

            // extra info
            extraInfo.title = "cc"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then Character Certificate receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो Character Certificate रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
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
        // console.log("certificateFeePayPost",certificateType)
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

        if (certificateType === "TC") {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await TC.findOne({ paymentRefNo: refNo })

            certificateSchema = TC
            // extra info
            extraInfo.title = "TC"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then TC receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो TC रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
        }

        if (certificateType === "cc") {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })
            existPaymentId = await CC.findOne({ paymentRefNo: refNo })
            
            certificateSchema = CC
            // extra info
            extraInfo.title = "cc"
            extraInfo.upiId = process.env.UPI_ID
            extraInfo.noteEnglish = "If payment screenshot is not valid then CharacterCertificate receipt will be invalid so upload valid payment screenshot."
            extraInfo.noteHindi = "यदि भुगतान स्क्रीनशॉट वैध नहीं है तो CharacterCertificate रसीद अमान्य होगी इसलिए वैध भुगतान स्क्रीनशॉट अपलोड करें।"
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
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.feeAmount)}&tn=${appliedUser.fullName}`, function (err, src) {
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

            if (!appliedUser.isPaid){
                res.redirect("/bonafied")
            }
        }

        if (certificateType === "tc") {
            appliedUser = await TC.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "TC"

            if (!appliedUser.isPaid){
                res.redirect("/tc")
            }
        }

        if (certificateType === "cc") {
            appliedUser = await CC.findOne({ appliedBy: user._id.toString() })

            // extra Info
            extraInfo.certificateType = "CC"

            if (!appliedUser.isPaid){
                res.redirect("/cc")
            }
        }

        res.render("certificateReceipt", { appliedUser, user, extraInfo })

    } catch (error) {
        console.log("Error in certificateFeePayPost => ", error)
    }
}
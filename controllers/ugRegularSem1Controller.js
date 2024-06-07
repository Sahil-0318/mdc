import ugRegularSem1AdmissionPortal from "../models/userModel/ugRegularSem1AdmissionPortalSchema.js"
import ugRegularSem1AdmissionForm from "../models/userModel/ugRegularSem1AdmissionFormSchema.js"
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import twilio from 'twilio'
import qrcode from 'qrcode'
import ugRegularSem1MeritList from "../models/adminModel/ugRegularSem1MeritList.js"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const twilioClient = new twilio(accountSid, authToken)

const ugRegularSem1 = async (req, res) => {
    res.render('ugRegularSem1')
}

const ugRegularSem1Post = async (req, res) => {
    try {
        let { course, referenceNumber, mobileNumber } = req.body

        // Generate Password Function
        let generatePassword = () => {
            let pass = ""
            for (let index = 0; index < 8; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generatePassword()

        const isExistRefNoINMeritList = await ugRegularSem1MeritList.findOne({ appNo: referenceNumber })

        if (isExistRefNoINMeritList != null) {
            const existReferenceNumber = await ugRegularSem1AdmissionPortal.findOne({ referenceNumber })

            if (existReferenceNumber === null) {

                await twilioClient.messages.create({
                    body: `Dear Student,\nYour login User Id is ${referenceNumber} & Password is ${genPassword}\nMD College, Naubatpur`,
                    to: "+91" + mobileNumber,
                    from: process.env.TWILIO_PHONE_NUMBER
                })

                const newUser = new ugRegularSem1AdmissionPortal({
                    course,
                    referenceNumber,
                    mobileNumber,
                    userId: referenceNumber,
                    password: genPassword
                })

                const registered = await newUser.save();
                res.status(201).redirect('ug-regular-sem-1-login')
            } else {
                res.render('ugRegularSem1', { "invalid": 'Reference No already register' });
            }
        } else {
            res.render('ugRegularSem1', { "invalid": 'Invalid Reference No' });
        }

    } catch (error) {

    }
}


const ugRegularSem1Login = async (req, res) => {
    res.render('ugRegularSem1Login')
}

const ugRegularSem1Logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('ug-regular-sem-1-login')
}

const ugRegularSem1LoginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await ugRegularSem1AdmissionPortal.findOne({ userId })
        if (foundUser != null) {
            if (password === foundUser.password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    course: foundUser.course,
                    referenceNumber: foundUser.referenceNumber
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('ug-reg-adm-form')
            } else {
                res.render('ugRegularSem1Login', { "invalid": "Invalid Username or Password" })
            }
        } else {
            return res.redirect('ug-regular-sem-1')
        }
    } catch (error) {

    }
}

const ugRegularSem1AdmForm = async (req, res) => {
    const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
    const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

    if (appliedUser != null) {
        res.render('ugRegularSem1AdmForm', { user, appliedUser })
    } else {
        res.render('ugRegularSem1AdmForm', { user })
    }

}

const ugRegularSem1AdmFormPost = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })

        const { studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber } = req.body

        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

        let admissionFee = ""

        const collCount = await ugRegularSem1AdmissionForm.countDocuments()
        // console.log(collCount);
        let collegeRollNo = collCount + 1
        // console.log(collegeRollNo);
        const existAdmNo = await ugRegularSem1AdmissionForm.findOne({ collegeRollNo })
        if (existAdmNo != null) {
            collegeRollNo = existAdmNo.admNo + 1
        } else {
            collegeRollNo = collCount + 1
        }

        if (appliedUser == null) {
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].path)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].path)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            // -------
            if (gender === "MALE") {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 3455
                    } else if (category === "BC-1"){
                        admissionFee = 2855
                    }else{
                        admissionFee = 1200
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2855
                    } else if (category === "BC-1"){
                        admissionFee = 2255
                    }else{
                        admissionFee = 600
                    }
                }
                
            } else {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    admissionFee = 1200
                } else {
                    admissionFee = 600
                }
            }

            const newAdmissionForm = new ugRegularSem1AdmissionForm({
                studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee,
                collegeRollNo
            })

            const savedForm = await newAdmissionForm.save()
            await ugRegularSem1AdmissionPortal.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isPaid: true } })
            res.redirect("ug-reg-sen-1-pay")

        } else {

        }

    } catch (error) {
        console.log('Error', error);

    }
}

const ugRegularSem1Pay = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

        if (appliedUser.admissionFee === "2855") {
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2855&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }else if (appliedUser.admissionFee === "2255"){
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=2255&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }else if (appliedUser.admissionFee === "600"){
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=600&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }else if (appliedUser.admissionFee === "3455"){
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=3455&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }else if (appliedUser.admissionFee === "1200"){
            qrcode.toDataURL(`upi://pay?pa=boim-440583400035@boi&am=1200&tn=${appliedUser.referenceNumber}`, function (err, src) {
                res.status(201).render('ugRegularSem1PayPage', { "qrcodeUrl": src, user, appliedUser })
            })
        }

    } catch (error) {

    }
}

const ugRegularSem1PayPage = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })

        const photoUpload = await FileUpload(req.file.path)
        const paymentSSURL = photoUpload.secure_url

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

        let receiptNo = "24MDC" + appliedUser.referenceNumber.substring(3, 10);

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL } })

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { dateAndTimeOfPayment } })

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentId: refNo } })

        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { isPaid: true } })
        await ugRegularSem1AdmissionForm.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { receiptNo } })

        res.redirect("ugRegularSem1Receipt")
    } catch (error) {
        console.log(error);
        
    }
}

const ugRegularSem1Receipt = async (req, res) => {
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem1Receipt", { appliedUser, user })
        } else {
            res.redirect("ug-reg-adm-form")
        }

    } catch (error) {
        console.log(error)
    }
}

const ugRegularSem1ExamForm = async (req, res) =>{
    try {
        const user = await ugRegularSem1AdmissionPortal.findOne({ _id: req.id })
        const appliedUser = await ugRegularSem1AdmissionForm.findOne({ appliedBy: user._id.toString() })
        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem1ExamForm", { appliedUser, user })
        } else {
            res.redirect("ug-reg-adm-form")
        }
    } catch (error) {
        console.log(error)
    }
}


export {
    ugRegularSem1,
    ugRegularSem1Post,
    ugRegularSem1Login,
    ugRegularSem1Logout,
    ugRegularSem1LoginPost,
    ugRegularSem1AdmForm,
    ugRegularSem1AdmFormPost,
    ugRegularSem1Pay,
    ugRegularSem1PayPage,
    ugRegularSem1Receipt,
    ugRegularSem1ExamForm
}
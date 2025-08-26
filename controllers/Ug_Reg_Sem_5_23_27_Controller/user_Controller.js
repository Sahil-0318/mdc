import PortalOnOff from "../../models/adminModel/portalOnOffSchema.js"
import Ug_Reg_Sem_5_23_27_User from "../../models/UG-Regular-Sem-5-23-27/user.js"
import { sendCredentialsOnMobile } from "../../Utils/send-credentials.js"
import { generateUserId, generatePassword } from "../../Utils/utils-function.js"
import jwt from 'jsonwebtoken'
import Ug_reg_sem_5_23_27_adm_form from "../../models/UG-Regular-Sem-5-23-27/admForm.js"
import FileUpload from '../../fileUpload/fileUpload.js'

// For download PDF Testing
import { fileURLToPath } from 'url';
import path from 'path';

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url)

import qrcode from 'qrcode'
import { generateReceiptNumber, generateOrderId } from "../../Utils/utils-function.js"

export const register = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem5_23-27" })
        if (portal.isOn == true) {
            res.render('Ug_Reg_Sem_5_23_27/register', { message: req.flash("flashMessage") })
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "UG Regular Sem 5 (2023 - 27) admission has been closed.", loginPage: "ug-reg-sem-5-23-27-login" })
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5-23-27_Controller >> user-Controller >> register", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-register");
    }
}

export const registerPost = async (req, res) => {
    try {
        const { course, fullName, mobileNumber, email } = req.body

        const existMobileNumber = await Ug_Reg_Sem_5_23_27_User.findOne({ mobileNumber })
        // console.log(existMobileNumber);
        if (existMobileNumber) {
            req.flash("flashMessage", ["Mobile number already exist", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27-register");
        }

        const existEmail = await Ug_Reg_Sem_5_23_27_User.findOne({ email })
        // console.log(existEmail);
        if (existEmail) {
            req.flash("flashMessage", ["Email already exist", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27-register");
        }

        let password = generatePassword()
        let userId = generateUserId(email, mobileNumber)
        sendCredentialsOnMobile(userId, password, mobileNumber)
        const user = new Ug_Reg_Sem_5_23_27_User({
            course,
            fullName,
            email,
            mobileNumber,
            userId,
            password
        })
        await user.save()
        req.flash("flashMessage", [`Registration successful, Credentials are sent to your Mobile : ${mobileNumber}`, "alert-success"]);
        return res.status(200).redirect("/ug-reg-sem-5-23-27-login");

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> registerPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-register");
    }
}

export const login = async (req, res) => {
    try {
        res.render('Ug_Reg_Sem_5_23_27/login', { message: req.flash("flashMessage") })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> login", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-login");
    }
}

export const loginPost = async (req, res) => {
    try {
        let { userId, password } = req.body
        // console.log(userId, password)
        const foundUser = await Ug_Reg_Sem_5_23_27_User.findOne({ userId, password })
        // console.log(foundUser)

        if (!foundUser) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27-login");
        }

        // If login is successful, you can set the user session or token here
        const token = jwt.sign({
            id: foundUser._id,
            mobileNumber: foundUser.mobileNumber,
            email: foundUser.email
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })
        res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

        req.flash("flashMessage", ["Login successful", "alert-success"]);
        return res.status(200).redirect("/ug-reg-sem-5-23-27-adm-form");

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> loginPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-login");
    }
}

export const logout = async (req, res) => {
    res.clearCookie("uid");
    req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
    return res.status(201).redirect("/ug-reg-sem-5-23-27-login");
}

export const admForm = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem5_23-27" })

        if (appliedUser) {
            res.render('Ug_Reg_Sem_5_23_27/admForm', { message: req.flash("flashMessage"), user, appliedUser })
        } else {
            res.render('Ug_Reg_Sem_5_23_27/admForm', { message: req.flash("flashMessage"), user, portal: portal.isOn })
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> admForm", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-login");
    }
}

export const admFormPost = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);

        const { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, examResult, obtMarks, fullMarks, obtPercent } = req.body

        let admissionFee = "";

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
                        admissionFee = 2905
                    } else if (category === "BC-1") {
                        admissionFee = 2905
                    } else {
                        admissionFee = 1500
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2305
                    } else if (category === "BC-1") {
                        admissionFee = 2305
                    } else {
                        admissionFee = 900
                    }
                }

            } else {
                if (user.course === "Bachelor of Science" || paper1 === "Psychology") {
                    admissionFee = 1500
                } else {
                    admissionFee = 900
                }
            }

            const newAdmissionForm = new Ug_reg_sem_5_23_27_adm_form({
                studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, examResult, obtMarks, fullMarks, obtPercent,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee
            })

            const savedForm = await newAdmissionForm.save()
            await Ug_Reg_Sem_5_23_27_User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })

            req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-warning"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27/payment/checkout");

        } else {
            req.flash("flashMessage", ["Already applied for admission", "alert-warning"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27-adm-form");
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> admFormPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}

export const checkoutPage = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_5_23_27/checkoutPage', { user, appliedUser })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> payment-Controller >> checkoutPage", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}

export const payGet = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('Ug_Reg_Sem_5_23_27/payPage', { "qrcodeUrl": src, user, appliedUser, "upiId": process.env.UPI_ID })
        })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> payment-Controller >> payGet", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}

export const payPost = async (req, res) => {
    try {
        const { paymentId } = req.body
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await Ug_reg_sem_5_23_27_adm_form.findOne({ paymentId })

        if (existPaymentId) {
            return qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.admissionFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                return res.status(201).render('Ug_Reg_Sem_5_23_27/payPage', {
                    "qrcodeUrl": src,
                    user,
                    appliedUser,
                    "upiId": process.env.UPI_ID,
                    invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)"
                });
            });
        }


        const images = req.files

        // console.log(images[0].path);
        const photoUpload = await FileUpload(images[0].path)
        const paymentSSURL = photoUpload.secure_url
        // console.log(paymentSSURL);

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

        let receiptNo = ""
        if (user.course === "Bachelor of Science") {
            receiptNo = generateReceiptNumber("BS", "SEM-5", generateOrderId());
        } else {
            receiptNo = generateReceiptNumber("BA", "SEM-5", generateOrderId());
        }

        await Ug_reg_sem_5_23_27_adm_form.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId, isPaid: true, receiptNo } })

        res.redirect("/ug-reg-sem-5-23-27/payment/payment-success")
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> payment-Controller >> payPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}

export const paymentSuccess = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id);
        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() });

        if (!appliedUser) {
            req.flash("flashMessage", ["No admission form found for this user.", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-5-23-27-adm-form");
        }

        // Render success page with user and appliedUser details
        res.render("Ug_Reg_Sem_5_23_27/paymentSuccess", { user, appliedUser, payment: appliedUser.paymentDetails });

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> payment-Controller >> paymentSuccess", error);
        req.flash("flashMessage", ["Internal Server Error", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}

export const downloadAdmFormPdf = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_5_23_27/admFormCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> downloadAdmFormPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}

export const downloadReceiptPdf = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_5_23_27_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_5_23_27_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_5_23_27/receiptCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_5_23_27_Controller >> user-Controller >> downloadReceiptPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-5-23-27-adm-form");
    }
}
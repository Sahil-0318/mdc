import PortalOnOff from "../../models/adminModel/portalOnOffSchema.js"
import Ug_Reg_Sem_1_25_29_ML_1 from "../../models/adminModel/UG_Reg_Sem_1_ML/Ug_Reg_Sem_1_25_29_ML_1.js"
import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"
import { sendCredentialsOnMobile } from "../../Utils/send-credentials.js"
import { generatePassword } from "../../Utils/utils-function.js"
import jwt from 'jsonwebtoken'
import Ug_reg_sem_1_25_29_adm_form from "../../models/Ug_Reg_Sem_1_25_29_Models/adm_Form.js"
import FileUpload from '../../fileUpload/fileUpload.js'

// For download PDF Testing
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import { renderFile } from 'ejs';

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//

export const register = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem1_25-29" })
        if (portal.isOn == true) {
            res.render('Ug_Reg_Sem_1_25_29/register', { message: req.flash("flashMessage") })
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "UG Regular Sem 1 (2025 - 29) admission has been closed.", loginPage: "/ug-reg-sem-1-25-29-login" })
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> register", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-register");
    }
}

export const registerPost = async (req, res) => {
    try {
        let { referenceNumber, mobileNumber, email } = req.body
        // console.log(referenceNumber)
        const isExistRefNoInMeritList = await Ug_Reg_Sem_1_25_29_ML_1.findOne({ appNo: referenceNumber })
        // console.log(isExistRefNoInMeritList);
        if (!isExistRefNoInMeritList) {
            req.flash("flashMessage", ["Reference number not found", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-register");
        }

        const isExistRefNoInUser = await Ug_Reg_Sem_1_25_29_User.findOne({ referenceNumber })
        // console.log(isExistRefNoInUser);
        if (isExistRefNoInUser) {
            req.flash("flashMessage", ["Already registered with this reference number", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-register");
        }

        const existMobileNumber = await Ug_Reg_Sem_1_25_29_User.findOne({ mobileNumber })
        // console.log(existMobileNumber);
        if (existMobileNumber) {
            req.flash("flashMessage", ["Mobile number already exist", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-register");
        }

        const existEmail = await Ug_Reg_Sem_1_25_29_User.findOne({ email })
        // console.log(existEmail);
        if (existEmail) {
            req.flash("flashMessage", ["Email already exist", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-register");
        }

        let course = ""
        if (isExistRefNoInMeritList.majorSubject === "Botany" || isExistRefNoInMeritList.majorSubject === "Mathematics" || isExistRefNoInMeritList.majorSubject === "Chemistry" || isExistRefNoInMeritList.majorSubject === "Physics" || isExistRefNoInMeritList.majorSubject === "Zoology") {
            course = "Bachelor of Science"

        } else if (isExistRefNoInMeritList.majorSubject === "English" || isExistRefNoInMeritList.majorSubject === "Hindi" || isExistRefNoInMeritList.majorSubject === "Urdu" || isExistRefNoInMeritList.majorSubject === "Philosophy") {
            course = "Bachelor of Arts (Humanities Subjects)"
        } else {
            course = "Bachelor of Arts (Social Science Subjects)"
        }

        let password = generatePassword()
        sendCredentialsOnMobile(referenceNumber, password, mobileNumber)
        const user = new Ug_Reg_Sem_1_25_29_User({
            course,
            referenceNumber,
            fullName: isExistRefNoInMeritList.candidateName,
            email,
            mobileNumber,
            userId: referenceNumber,
            password
        })
        await user.save()
        req.flash("flashMessage", [`Registration successful, Credentials are sent to your Mobile : ${mobileNumber}`, "alert-success"]);
        return res.status(200).redirect("/ug-reg-sem-1-25-29-login");

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> registerPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-register");
    }
}

export const login = async (req, res) => {
    try {
        res.render('Ug_Reg_Sem_1_25_29/login', { message: req.flash("flashMessage") })
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> login", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-login");
    }
}

export const loginPost = async (req, res) => {
    try {
        let { userId, password } = req.body
        // console.log(userId, password)
        const foundUser = await Ug_Reg_Sem_1_25_29_User.findOne({ userId, password })
        // console.log(foundUser)

        if (!foundUser) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-login");
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
        return res.status(200).redirect("/ug-reg-sem-1-25-29-adm-form");

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> loginPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-login");
    }
}

export const logout = async (req, res) => {
    res.clearCookie("uid");
    req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
    return res.status(201).redirect("/ug-reg-sem-1-25-29-login");
}

export const admForm = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        // changes start here for all merit list
        let meritListStudents = ""
        if (await Ug_Reg_Sem_1_25_29_ML_1.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_1.findOne({ appNo: user.referenceNumber })
        } else if (await Ug_Reg_Sem_1_25_29_ML_2.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_2.findOne({ appNo: user.referenceNumber })
        } else if (await Ug_Reg_Sem_1_25_29_ML_3.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_3.findOne({ appNo: user.referenceNumber })
        } else if (await Ug_Reg_Sem_1_25_29_ML_4.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_4.findOne({ appNo: user.referenceNumber })
        } else if (await Ug_Reg_Sem_1_25_29_ML_5.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_5.findOne({ appNo: user.referenceNumber })
        } else if (await Ug_Reg_Sem_1_25_29_ML_6.findOne({ appNo: user.referenceNumber })) {
            meritListStudents = await Ug_Reg_Sem_1_25_29_ML_6.findOne({ appNo: user.referenceNumber })
        }

        const portal = await PortalOnOff.findOne({ portal: "ugRegularSem1_25-29" })

        if (appliedUser) {
            res.render('Ug_Reg_Sem_1_25_29/admForm', { message: req.flash("flashMessage"), user, appliedUser })
        } else {
            res.render('Ug_Reg_Sem_1_25_29/admForm', { message: req.flash("flashMessage"), user, meritListStudents, portal: portal.isOn })
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> admForm", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-login");
    }
}

export const admFormPost = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);

        const { studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber } = req.body

        let admissionFee = "";
        let collegeRollNo = "";

        let streamPrefix = "";
        if (["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"].includes(paper1)) {
            streamPrefix = "BS"; // Bachelor of Science
        } else {
            streamPrefix = "BA"; // Bachelor of Arts
        }

        // Find the latest roll number for the stream
        let lastRoll = await Ug_reg_sem_1_25_29_adm_form
            .findOne({ collegeRollNo: { $regex: `^${streamPrefix}\\d+$` } })
            .sort({ collegeRollNo: -1 }) // Sort in descending order
            .lean();

        if (lastRoll && lastRoll.collegeRollNo) {
            let lastNumber = parseInt(lastRoll.collegeRollNo.slice(2)); // Remove "BS"/"BA" prefix
            collegeRollNo = `${streamPrefix}${lastNumber + 1}`;
        } else {
            collegeRollNo = `${streamPrefix}1`; // Start from 1 if no previous roll exists
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
                    } else if (category === "BC-1") {
                        admissionFee = 2855
                    } else {
                        admissionFee = 1200
                    }
                } else {
                    if (category === "GENERAL" || category === "BC-2") {
                        admissionFee = 2855
                    } else if (category === "BC-1") {
                        admissionFee = 2255
                    } else {
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

            const newAdmissionForm = new Ug_reg_sem_1_25_29_adm_form({
                studentName, fatherName, motherName, guardianName, referenceNumber, email, applicantId, dOB, gender, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                admissionFee,
                collegeRollNo
            })

            const savedForm = await newAdmissionForm.save()
            await Ug_Reg_Sem_1_25_29_User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })

            req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-warning"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29/payment/checkout");

        } else {
            req.flash("flashMessage", ["Already applied for admission", "alert-warning"]);
            return res.status(404).redirect("/ug-reg-sem-1-25-29-adm-form");
        }
    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> admFormPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/ug-reg-sem-1-25-29-adm-form");
    }
}

export const downloadAdmFormPdf = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_1_25_29/admFormCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> downloadAdmFormPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("ug-reg-sem-1-25-29-adm-form");
    }
}

export const downloadReceiptPdf = async (req, res) => {
    try {
        const user = await Ug_Reg_Sem_1_25_29_User.findById(req.id)
        // console.log(user)

        const appliedUser = await Ug_reg_sem_1_25_29_adm_form.findOne({ appliedBy: user._id.toString() })

        res.render('Ug_Reg_Sem_1_25_29/receiptCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in Ug_Reg_Sem_1_25_29_Controller >> user-Controller >> downloadReceiptPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("ug-reg-sem-1-25-29-adm-form");
    }
}
import BCA_3_23_26_User from "../../models/userModel/BCA_3_23_26_Model/user_Model.js";
import BCA_3_23_26_Form from "../../models/userModel/BCA_3_23_26_Model/form_Model.js";
import PortalOnOff from "../../models/adminModel/portalOnOffSchema.js";
import jwt from 'jsonwebtoken'
import FileUpload from "../../fileUpload/fileUpload.js";
import { sendCredentialsOnMobile } from "../../Utils/send-credentials.js";
import { generatePassword, generateUserId } from "../../Utils/utils-function.js";

export const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "bca3_23-26" })
        if (portal.isOn == true) {
            return res.render("BCA_3_23_26/signup", { message: req.flash("flashMessage") })
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "BCA Part 3 (2023 - 26) admission has not started yet.", loginPage: "bca-3-23-26-login" })
        }
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> signup", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-signup");
    }
}

export const signupPost = async (req, res) => {
    try {
        const { fullName, mobileNumber, email } = req.body

        const existMobileNumber = await BCA_3_23_26_User.findOne({ mobileNumber })
        // console.log(existMobileNumber);
        if (existMobileNumber) {
            req.flash("flashMessage", ["Mobile number already exist", "alert-danger"]);
            return res.status(404).redirect("/bca-3-23-26-signup");
        }

        const existEmail = await BCA_3_23_26_User.findOne({ email })
        // console.log(existEmail);
        if (existEmail) {
            req.flash("flashMessage", ["Email already exist", "alert-danger"]);
            return res.status(404).redirect("/bca-3-23-26-signup");
        }

        const userId = generateUserId(email, mobileNumber)
        const password = generatePassword()

        sendCredentialsOnMobile(userId, password, mobileNumber)

        const newUser = new BCA_3_23_26_User({
            fullName: fullName.trim(),
            email: email.trim(),
            mobileNumber: mobileNumber.trim(),
            userId,
            password
        })

        await newUser.save();

        req.flash("flashMessage", [`Signup successful, Credentials are sent to your Mobile : ${mobileNumber}`, "alert-success"]);
        return res.status(200).redirect("/bca-3-23-26-login");
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> signupPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-signup");
    }
}

export const login = async (req, res) => {
    try {
        res.render("BCA_3_23_26/login", { message: req.flash("flashMessage") })
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> login", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-login");
    }
}

export const loginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await BCA_3_23_26_User.findOne({ userId, password })

        if (!foundUser) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.status(404).redirect("/bca-3-23-26-login");
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
        return res.status(200).redirect("/bca-3-23-26-adm-form");
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> loginPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-login");
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("uid");
        req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
        return res.status(201).redirect("/bca-3-23-26-login");
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> logout", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-login");
    }
}

export const admForm = async (req, res) => {
    try {
        const user = await BCA_3_23_26_User.findOne({ _id: req.id })
        const appliedUser = await BCA_3_23_26_Form.findOne({ appliedBy: user._id.toString() })
        if (appliedUser) {
            return res.render("BCA_3_23_26/admForm", { message: req.flash("flashMessage"), user, appliedUser })
        } else {
            return res.render("BCA_3_23_26/admForm", { message: req.flash("flashMessage"), user })
        }
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> admForm", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-adm-form");
    }
}

export const admFormPost = async (req, res) => {
    try {
        const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const user = await BCA_3_23_26_User.findOne({ _id: req.id })
        const appliedUser = await BCA_3_23_26_Form.findOne({ appliedBy: user._id.toString() })

        if (appliedUser) {
            req.flash("flashMessage", ["Already applied for admission", "alert-warning"]);
            return res.status(404).redirect("/bca-3-23-26-adm-form");
        }

        const images = req.files

        // console.log(req.files);
        // console.log(images[0].buffer);
        const photoUpload = await FileUpload(images[0].buffer)
        const photoURL = photoUpload.secure_url
        // console.log(photoURL);

        // console.log(images[1].path);
        const signUpload = await FileUpload(images[1].buffer)
        const signURL = signUpload.secure_url
        // console.log(signURL);

        const newForm = new BCA_3_23_26_Form({
            studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent,
            studentPhoto: photoURL,
            studentSign: signURL,
            appliedBy: user._id
        })

        await newForm.save()
        await BCA_3_23_26_User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-warning"]);
        return res.status(404).redirect("/bca-3-23-26/payment/checkout");

    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> admFormPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-adm-form");
    }
}

export const downloadAdmFormPdf = async (req, res) => {
    try {
        const user = await BCA_3_23_26_User.findById(req.id)
        // console.log(user)

        const appliedUser = await BCA_3_23_26_Form.findOne({ appliedBy: user._id.toString() })

        res.render('BCA_3_23_26/admFormCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> downloadAdmFormPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-adm-form");
    }
}

export const downloadReceiptPdf = async (req, res) => {
    try {
        const user = await BCA_3_23_26_User.findById(req.id)
        // console.log(user)

        const appliedUser = await BCA_3_23_26_Form.findOne({ appliedBy: user._id.toString() })

        res.render('BCA_3_23_26/receiptCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> user-Controller >> downloadReceiptPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-adm-form");
    }
}
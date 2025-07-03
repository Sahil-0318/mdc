import BCA_2_24_27_User from "../../models/userModel/BCA_2_24_27_Model/user_Model.js";
import BCA_2_24_27_Form from "../../models/userModel/BCA_2_24_27_Model/form_Model.js";
import PortalOnOff from "../../models/adminModel/portalOnOffSchema.js";
import jwt from 'jsonwebtoken'
import FileUpload from "../../fileUpload/fileUpload.js";
import { sendCredentialsOnMobile } from "../../Utils/send-credentials.js";
import { generatePassword, generateUserId } from "../../Utils/utils-function.js";

export const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "bca2_24-27" })
        if (portal.isOn == true) {
            return res.render("BCA_2_24_27/signup", { message: req.flash("flashMessage") })
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "BCA Part 2 (2024 - 27) admission has been closed.", loginPage: "bca-2-24-27-login" })

            // return res.render('pageNotFound', { status: "BCA Part 2 (2024 - 27) admission not started.", loginPage: "bca-2-24-27-login" })
        }
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> signup", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-signup");
    }
}

export const signupPost = async (req, res) => {
    try {
        const { fullName, mobileNumber, email } = req.body

        const existMobileNumber = await BCA_2_24_27_User.findOne({ mobileNumber })
        // console.log(existMobileNumber);
        if (existMobileNumber) {
            req.flash("flashMessage", ["Mobile number already exist", "alert-danger"]);
            return res.status(404).redirect("/bca-2-24-27-signup");
        }

        const existEmail = await BCA_2_24_27_User.findOne({ email })
        // console.log(existEmail);
        if (existEmail) {
            req.flash("flashMessage", ["Email already exist", "alert-danger"]);
            return res.status(404).redirect("/bca-2-24-27-signup");
        }

        const userId = generateUserId(email, mobileNumber)
        const password = generatePassword()

        sendCredentialsOnMobile(userId, password, mobileNumber)

        const newUser = new BCA_2_24_27_User({
            fullName: fullName.trim(),
            email: email.trim(),
            mobileNumber: mobileNumber.trim(),
            userId,
            password
        })

        await newUser.save();

        req.flash("flashMessage", [`Signup successful, Credentials are sent to your Mobile : ${mobileNumber}`, "alert-success"]);
        return res.status(200).redirect("/bca-2-24-27-login");
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> signupPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-signup");
    }
}

export const login = async (req, res) => {
    try {
        res.render("BCA_2_24_27/login", { message: req.flash("flashMessage") })
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> login", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-login");
    }
}

export const loginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await BCA_2_24_27_User.findOne({ userId, password })

        if (!foundUser) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.status(404).redirect("/bca-2-24-27-login");
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
        return res.status(200).redirect("/bca-2-24-27-adm-form");
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> loginPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-login");
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("uid");
        req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
        return res.status(201).redirect("/bca-2-24-27-login");
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> logout", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-login");
    }
}

export const admForm = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findOne({ _id: req.id })
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })
        if (appliedUser) {
            return res.render("BCA_2_24_27/admForm", { message: req.flash("flashMessage"), user, appliedUser })
        } else {
            return res.render("BCA_2_24_27/admForm", { message: req.flash("flashMessage"), user })
        }
    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> admForm", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const admFormPost = async (req, res) => {
    try {
        const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const user = await BCA_2_24_27_User.findOne({ _id: req.id })
        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        if (appliedUser) {
            req.flash("flashMessage", ["Already applied for admission", "alert-warning"]);
            return res.status(404).redirect("/bca-2-24-27-adm-form");
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

        const newForm = new BCA_2_24_27_Form({
            studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, examResult, obtMarks, fullMarks, obtPercent,
            studentPhoto: photoURL,
            studentSign: signURL,
            appliedBy: user._id
        })

        await newForm.save()
        await BCA_2_24_27_User.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-warning"]);
        return res.status(404).redirect("/bca-2-24-27/payment/checkout");

    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> admFormPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const downloadAdmFormPdf = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findById(req.id)
        // console.log(user)

        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        res.render('BCA_2_24_27/admFormCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> downloadAdmFormPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}

export const downloadReceiptPdf = async (req, res) => {
    try {
        const user = await BCA_2_24_27_User.findById(req.id)
        // console.log(user)

        const appliedUser = await BCA_2_24_27_Form.findOne({ appliedBy: user._id.toString() })

        res.render('BCA_2_24_27/receiptCopy', { message: req.flash("flashMessage"), user, appliedUser })

    } catch (error) {
        console.log("Error in BCA_Sem_2_24_27_Controller >> user-Controller >> downloadReceiptPdf", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-2-24-27-adm-form");
    }
}
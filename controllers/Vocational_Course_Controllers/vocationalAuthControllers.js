// Importing Models
import VocationalAdmPortal from "../../models/Vocational_Course_Models/vocationalAdmPortalModel.js"

import BCAPart1MeritList from "../../models/Vocational_Course_Models/BCA_Models/bcaPart1MeritListModel.js"
import BCAStudent from "../../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js"

// Importing Utils Functions
import { generateUserId, generatePassword, sendCredentialsOnMobile } from "../../Utils/utils-function.js"

// Importing Modules
import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    const { course, courseSession } = req.params

    try {
        const admPortalStatus = await VocationalAdmPortal.findOne({ "degree": course, courseSession })
        if (!admPortalStatus) {
            return res.render("vocationalCommonPages/pageNotFound", { status: "Page! You are looking for doesn't exist." })
        }
        if (!admPortalStatus.isPart1AdmActive) {
            return res.render("vocationalCommonPages/pageNotFound", { status: "Admission Portal has been closed." })
        }

        let data = {
            pageTitle: `${course.toUpperCase()} Part 1 (${courseSession}) Admission Signup`,
            course,
            courseSession,
        }
        res.render("vocationalCommonPages/signup", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> signup :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/${course}-${courseSession}/signup`);
    }
}


export const signupPost = async (req, res) => {
    const { course, courseSession } = req.params

    try {
        const { referenceNumber, mobileNumber, email } = req.body

        if (course === 'bca') {
            // Validate reference number in merit list
            const meritRecord = await BCAPart1MeritList.findOne({ referenceNumber });
            if (!meritRecord) {
                req.flash("flashMessage", ["Reference number not found", "alert-danger"]);
                return res.redirect(`/${course}-${courseSession}/signup`);
            }

            // Check if student already registered
            const existingStudent = await BCAStudent.findOne({
                $or: [{ referenceNumber }, { mobileNumber }, { email }]
            });

            if (existingStudent) {
                const conflictMsg = existingStudent.referenceNumber === referenceNumber
                    ? "Already registered with this reference number"
                    : existingStudent.mobileNumber === mobileNumber
                        ? "Mobile number already exists"
                        : "Email already exists";

                req.flash("flashMessage", [conflictMsg, "alert-danger"]);
                return res.redirect(`/${course}-${courseSession}/signup`);
            }

            // Generate credentials
            const userId = generateUserId(email, mobileNumber);
            const password = generatePassword();

            try {
                await sendCredentialsOnMobile(userId, password, mobileNumber);
            } catch (emailError) {
                console.error("Failed to send credentials on mobile:", emailError);
                req.flash("flashMessage", ["Failed to send credentials to your mobile. Please try again.", "alert-danger"]);
                return res.redirect(`/${course}-${courseSession}/signup`);
            }

            const { studentName, fatherName, gender, dOB } = meritRecord

            const newStudent = new BCAStudent({
                courseSession,
                userId,
                password,
                referenceNumber,
                studentName,
                gender,
                dOB,
                email,
                mobileNumber,
                fatherName
            });

            await newStudent.save();
        }

        req.flash("flashMessage", [`Signup successful. Credentials sent to Mobile No.`, "alert-success"]);
        return res.redirect(`/vocational-student/login`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> signupPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/${course}-${courseSession}/signup`);
    }
}


export const login = async (req, res) => {
  try {
    const sessionArray = [];

    const smallest = await VocationalAdmPortal.findOne()
      .sort({ courseSession: 1 })
      .select("courseSession")
      .lean();

    const greatest = await VocationalAdmPortal.findOne()
      .sort({ courseSession: -1 })
      .select("courseSession")
      .lean();

    if (smallest && greatest) {
      const startYear = parseInt(smallest.courseSession.split("-")[0]);
      const endYear = parseInt(greatest.courseSession.split("-")[0]);

      for (let year = startYear; year <= endYear; year++) {
        sessionArray.push(`${year}-${year + 3}`);
      }
    }

    const data = {
      pageTitle: "Vocational Student Login",
      sessionArray
    };

    res.render("vocationalCommonPages/login", {
      message: req.flash("flashMessage"),
      data
    });
  } catch (error) {
    console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> login :", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect("/vocational-student/login");
  }
};



export const loginPost = async (req, res) => {

    try {
        const { course, courseSession, userId, password } = req.body

        let existingStudent;
        if (course === 'bca') {
            existingStudent = await BCAStudent.findOne({ courseSession, userId, password })
        }

        if (!existingStudent) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.redirect(`/vocational-student/login`);
        }

        const token = jwt.sign({
            id: existingStudent._id,
            courseSession: existingStudent.courseSession,
            mobileNumber: existingStudent.mobileNumber,
            email: existingStudent.email
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })

        res.cookie('vocationalUID', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })

        req.flash("flashMessage", ["Login successful !!", "alert-success"]);
        return res.redirect(`/${course}-${courseSession}/dashboard`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> loginPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/login`);
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("vocationalUID");
        req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
        return res.redirect("/vocational-student/login");
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> logout :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/login`);
    }
}


export const forgotPassword = async (req, res) => {
    try {
        let sessionArray = []
        const smallest = await VocationalAdmPortal.findOne().sort({ courseSession: 1 }).select("courseSession").lean();
        const greatest = await VocationalAdmPortal.findOne().sort({ courseSession: -1 }).select("courseSession").lean();

        const startYear = parseInt(smallest.courseSession.split("-")[0]);
        const endYear = parseInt(greatest.courseSession.split("-")[0]);

        for (let year = startYear; year <= endYear; year++) {
            sessionArray.push(`${year}-${year + 3}`);
        }
        let data = {
            pageTitle: `Vocational Student Forgot Password`,
            sessionArray
        }
        res.render("vocationalCommonPages/forgotPassword", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> forgotPassword :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/login`);
    }
}


export const forgotPasswordPost = async (req, res) => {
    try {
        const { course, courseSession, mobileNumber } = req.body

        let existingStudent;
        if (course === 'bca') {
            existingStudent = await BCAStudent.findOne({ courseSession, mobileNumber })
        }

        if (!existingStudent) {
            req.flash("flashMessage", ["Data not found...", "alert-danger"]);
            return res.redirect(`/vocational-student/forgot-password`);
        }

        const password = generatePassword();

        try {
            await sendCredentialsOnMobile(existingStudent.userId, password, mobileNumber);
        } catch (emailError) {
            console.error("Failed to send credentials on mobile:", emailError);
            req.flash("flashMessage", ["Failed to send credentials to your mobile. Please try again.", "alert-danger"]);
            return res.redirect(`/vocational-student/forgot-password`);
        }
        existingStudent.password = password
        await existingStudent.save();

        req.flash("flashMessage", [`Password Reset successful. New Password is sent to Mobile No.`, "alert-success"]);
        return res.redirect(`/vocational-student/login`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> forgotPasswordPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/forgot-password`);
    }
}
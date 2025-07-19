import AdminModel from '../../models/adminRoleModels/adminModel.js'
// Importing Modules
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
    const { user } = req.params
    try {
        const foundUser = await AdminModel.findOne({ role: user })
        if (!foundUser) {
            req.flash("flashMessage", ["User not found"]);
            return res.render("Admin/errorPage", { status: "Page! You are looking for not found!" });
        }
        let data = {
            pageTitle: `${user.toUpperCase()} Login`,
            foundUser
        }
        res.render("Admin/login", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> adminAuthController >> login :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/login/${user}`);
    }
}


export const loginPost = async (req, res) => {
    const { user } = req.params
    try {
        const { userId, password } = req.body

        let foundUser = await AdminModel.findOne({ userId, password })

        if (!foundUser) {
            req.flash("flashMessage", ["Invalid credentials", "alert-danger"]);
            return res.redirect(`/login/${user}`);
        }

        const token = jwt.sign({
            id: foundUser._id,
        }, process.env.SECRET_KEY,
            { expiresIn: "7d" })

        res.cookie('UID', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })

        req.flash("flashMessage", ["Login successful !!", "alert-success"]);
        return res.redirect(`/${user}/dashboard`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> loginPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/login`);
    }
}


export const logout = async (req, res) => {
    const { user } = req.params
    try {
        res.clearCookie("UID");
        req.flash("flashMessage", ["Logout successfully !!", "alert-danger"]);
        return res.redirect(`/login/${user}`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> vocationalAuthControllers >> logout :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/login/${user}`);
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
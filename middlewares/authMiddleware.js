import jwt from "jsonwebtoken";

import BCAStudent from "../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js";

// BCA Student Auth
export const bcaStudentAuth = async (req, res, next) => {
    try {
        const token = req.cookies.vocationalUID;
        if (!token) {
            req.flash("flashMessage", ["Please, login to access this page", "alert-danger"]);
            return res.redirect(`/vocational-student/login`);
        }

        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const student = await BCAStudent.findById(id);

        if (!student) {
            req.flash("flashMessage", ["Invalid token or user not found", "alert-danger"]);
            return res.redirect(`/vocational-student/login`);
        }

        req.id = student._id;
        req.courseSession = student.session;
        req.mobileNumber = student.mobileNumber;
        req.email = student.email;
        next();

    } catch (error) {
        console.error("BCA Student Auth Middleware Error:", error.message);
        req.flash("flashMessage", ["Authentication failed. Please login again.", "alert-danger"]);
        return res.redirect(`/vocational-student/login`);
    }
};
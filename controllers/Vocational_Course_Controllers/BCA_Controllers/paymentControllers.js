import BCAStudent from "../../../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js"
import BCAPart1AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part1AdmFormModel.js"
import BCAPart2AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part2AdmFormModel.js"
import BCAPart3AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part3AdmFormModel.js"
import VocationalAdmPortal from "../../../models/Vocational_Course_Models/vocationalAdmPortalModel.js"
// Importing Utils Functions
import { generateBCAReceiptNo, sixDigitRandomNumber } from "../../../Utils/vocational-utils.js"
import { uploadFile } from "../../../middlewares/mediaMiddleware.js"
import { getDateAndTime } from "../../../Utils/utils-function.js"

// QR Method
import qrcode from 'qrcode'

export const payment = async (req, res) => {
    const { coursePart, courseSession } = req.params;

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .select('-password')
            .populate("part1AdmForm")
            .populate("part2AdmForm")
            .populate("part3AdmForm");

        if (!existingStudent) {
            return res.render("vocationalCommonPages/pageNotFound", { status: "Student doesn't exist." });
        }

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });
        if (!admPortalStatus) {
            return res.render("vocationalCommonPages/pageNotFound", { status: "Portal status not found." });
        }

        const data = {
            pageTitle: `BCA Part ${coursePart} (${courseSession}) Fee Payment`,
            existingStudent,
            coursePart,
            courseSession,
            upiId: process.env.VOC_UPI_ID,
            admPortalStatus,
            activeTab: `Part ${coursePart}`,
            activeTabList: `Part ${coursePart} Adm Form`,
        };

        // Validate based on course part
        if (coursePart == 1) {
            if (!admPortalStatus.isPart1AdmActive || !existingStudent.part1AdmForm) {
                data.alertStatus = 'Oops! Page not found.';
                data.alertDes = 'Part 1 Admission is not active or form not filled.';
                return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
            }

            const fee = Number(existingStudent.part1AdmForm.totalFee);
            return qrcode.toDataURL(
                `upi://pay?pa=${data.upiId}&am=${fee}&tn=${existingStudent.studentName}`,
                (err, src) => {
                    res.render('BCA/payment', { message: req.flash("flashMessage"), qrcodeUrl: src, data });
                }
            );
        }

        if (coursePart == 2) {
            if (!admPortalStatus.isPart2AdmActive || !existingStudent.part2AdmForm) {
                data.alertStatus = 'Oops! Page not found.';
                data.alertDes = 'Part 2 Admission is not active or form not filled.';
                return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
            }

            const fee = Number(existingStudent.part2AdmForm.totalFee);
            return qrcode.toDataURL(
                `upi://pay?pa=${data.upiId}&am=${fee}&tn=${existingStudent.studentName}`,
                (err, src) => {
                    res.render('BCA/payment', { message: req.flash("flashMessage"), qrcodeUrl: src, data });
                }
            );
        }

        if (coursePart == 3) {
            if (!admPortalStatus.isPart3AdmActive || !existingStudent.part3AdmForm) {
                data.alertStatus = 'Oops! Page not found.';
                data.alertDes = 'Part 3 Admission is not active or form not filled.';
                return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
            }

            const fee = Number(existingStudent.part3AdmForm.totalFee);
            return qrcode.toDataURL(
                `upi://pay?pa=${data.upiId}&am=${fee}&tn=${existingStudent.studentName}`,
                (err, src) => {
                    res.render('BCA/payment', { message: req.flash("flashMessage"), qrcodeUrl: src, data });
                }
            );
        }

        // If invalid coursePart
        data.alertStatus = 'Invalid Course Part';
        data.alertDes = 'Only Part 1 Part 2 and Part 3 payments are handled.';
        return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });

    } catch (error) {
        console.error("Error in BCA payment controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-${coursePart}-${courseSession}/payment`);
    }
};


export const paymentPost = async (req, res) => {
    const { coursePart, courseSession } = req.params;

    try {
        const { paymentId } = req.body;
        const images = req.files;
        const dateAndTimeOfPayment = getDateAndTime();

        // Check if paymentId exists in any of the three collections
        const isDuplicatePaymentId =
            await BCAPart1AdmForm.findOne({ paymentId }) ||
            await BCAPart2AdmForm.findOne({ paymentId }) ||
            await BCAPart3AdmForm.findOne({ paymentId });

        if (isDuplicatePaymentId) {
            req.flash("flashMessage", ["Invalid Payment Id", "alert-danger"]);
            return res.redirect(`/bca-${coursePart}-${courseSession}/payment`);
        }

        // Upload screenshot
        let paymentScreenshot = "";
        try {
            const screenshot = await uploadFile(images[0].buffer);
            paymentScreenshot = screenshot.secure_url;
        } catch (uploadErr) {
            console.error("Upload error:", uploadErr);
            req.flash("flashMessage", ["Error uploading files. Please try again.", "alert-danger"]);
            return res.redirect(`/bca-${coursePart}-${courseSession}/payment`);
        }

        // Fetch student
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .select("-password")
            .populate("part1AdmForm part2AdmForm part3AdmForm");

        if (!existingStudent) throw new Error("Student not found");

        const receiptNo = generateBCAReceiptNo(coursePart, sixDigitRandomNumber());

        // Update relevant part form
        const partForms = {
            1: BCAPart1AdmForm,
            2: BCAPart2AdmForm,
            3: BCAPart3AdmForm
        };

        await partForms[coursePart].findOneAndUpdate(
            { appliedBy: existingStudent._id.toString() },
            { $set: { paymentScreenshot, dateAndTimeOfPayment, paymentId, isPaid: true, receiptNo } }
        );

        // Update roll number for Part 1
        if (Number(coursePart) === 1) {
            const paidCount = await BCAPart1AdmForm.countDocuments({ isPaid: true, courseSession });
            await BCAStudent.findByIdAndUpdate(existingStudent._id, { $set: { collegeRollNo: paidCount } });
        }

        res.redirect(`/bca-${coursePart}-${courseSession}/paymentSuccess`);
    } catch (error) {
        console.error("Error in paymentPost:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-${coursePart}-${courseSession}/payment`);
    }
};


export const paymentSuccess = async (req, res) => {
    const { coursePart, courseSession } = req.params

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password').populate("part1AdmForm").populate("part2AdmForm").populate("part3AdmForm")
        if (!existingStudent) throw new Error("Student not found");
        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });
        let data = {
            pageTitle: `BCA Part ${coursePart} (${courseSession}) Payment Success`,
            coursePart,
            existingStudent,
            courseSession,
            admPortalStatus
        }

        if (coursePart == 1) {
            if ( existingStudent.part1AdmForm !== null && existingStudent.part1AdmForm.isPaid ) {
                return res.render('BCA/paymentSuccess', { message: req.flash("flashMessage"), data })
            }
        }

        if (coursePart == 2) {
            if ( existingStudent.part2AdmForm !== null && existingStudent.part2AdmForm.isPaid ) {
                return res.render('BCA/paymentSuccess', { message: req.flash("flashMessage"), data })
            }
        }

        if (coursePart == 3) {
            if ( existingStudent.part3AdmForm !== null && existingStudent.part3AdmForm.isPaid ) {
                return res.render('BCA/paymentSuccess', { message: req.flash("flashMessage"), data })
            }
        }

        data.alertStatus = 'Invalid Course Part';
        data.alertDes = 'Only Part 1 Part 2 and Part 3 payments are handled.';
        return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> paymentCpntrollers >> payment :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-${coursePart}-${courseSession}/payment`);
    }
}
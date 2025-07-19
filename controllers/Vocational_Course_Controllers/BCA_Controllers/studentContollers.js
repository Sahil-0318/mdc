// Importing Models
import VocationalAdmPortal from "../../../models/Vocational_Course_Models/vocationalAdmPortalModel.js"
import BCAStudent from "../../../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js"
import BCAPart1AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part1AdmFormModel.js"
import BCAPart2AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part2AdmFormModel.js"
import BCAPart3AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part3AdmFormModel.js"

// Importing Utils Functions
import { uploadFile } from "../../../middlewares/mediaMiddleware.js"
import { getLastExamYear } from "../../../Utils/vocational-utils.js"



export const dashboard = async (req, res) => {
    const { courseSession } = req.params

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).populate("part1AdmForm").select('-password')
        if (!existingStudent) {
            return res.render("vocationalCommonPages/pageNotFound", { status: "Student doesn't exist." })
        }
        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });
        let data = {
            pageTitle: `BCA (${courseSession}) Student Dashboard`,
            existingStudent,
            activeTab: "",
            activeTabList: "dashboard",
            admPortalStatus
        }
        res.render("BCA/dashboard", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> dashboard :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/vocational-student/login`);
    }
}


export const part1AdmForm = async (req, res) => {
    const { courseSession } = req.params;

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .populate("part1AdmForm")
            .select("-password");

        if (!existingStudent) {
            req.flash("flashMessage", ["Student not found", "alert-danger"]);
            return res.redirect(`/bca-1-${courseSession}/dashboard`);
        }

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });

        const data = {
            pageTitle: `BCA Part 1 ${courseSession} Admission Form`,
            activeTab: "Part 1",
            activeTabList: "Part 1 Adm Form",
            course: "bca",
            courseSession,
            existingStudent,
            admPortalStatus
        };

        if (!admPortalStatus || !admPortalStatus.isPart1AdmActive) {
            data.alertStatus = 'Oops! You are late.'
            data.alertDes = `BCA Part 1 (${courseSession}) Admission has been closed.`
            return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
        }

        return res.render("BCA/part1AdmForm", { message: req.flash("flashMessage"), data });

    } catch (error) {
        console.error("Error in part1AdmForm controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-1-${courseSession}/admForm`);
    }
};


export const part1AdmFormPost = async (req, res) => {
    const { courseSession } = req.params
    try {

        const { motherName, guardianName, applicantId, familyAnnualIncome, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, ppuConfidentialNumber } = req.body

        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password')
        if (!existingStudent) throw new Error("Student not found");

        const images = req.files
        let photoURL, signURL

        try {
            const photoUpload = await uploadFile(images[0].buffer)
            photoURL = photoUpload.secure_url
            const signUpload = await uploadFile(images[1].buffer)
            signURL = signUpload.secure_url
        } catch (uploadErr) {
            console.error('Upload error:', uploadErr);
            req.flash("flashMessage", ["Error uploading files. Please try again.", "alert-danger"]);
            return res.redirect(`/bca-1-${courseSession}/admForm`);
        }

        let admissionFee = 15000
        let extraFee = 0
        let totalFee = admissionFee + extraFee

        const BCAPart1AdmFormDetails = new BCAPart1AdmForm({
            courseSession: existingStudent.courseSession, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, appliedBy: existingStudent._id, admissionFee, extraFee, totalFee
        });

        const savedBCAPart1AdmFormDetails = await BCAPart1AdmFormDetails.save();

        existingStudent.motherName = motherName
        existingStudent.guardianName = guardianName
        existingStudent.applicantId = applicantId
        existingStudent.familyAnnualIncome = familyAnnualIncome
        existingStudent.religion = religion
        existingStudent.category = category
        existingStudent.bloodGroup = bloodGroup
        existingStudent.physicallyChallenged = physicallyChallenged
        existingStudent.maritalStatus = maritalStatus
        existingStudent.aadharNumber = aadharNumber
        existingStudent.whatsAppNumber = whatsAppNumber
        existingStudent.address = address
        existingStudent.district = district
        existingStudent.policeStation = policeStation
        existingStudent.state = state
        existingStudent.pinCode = pinCode
        existingStudent.ppuConfidentialNumber = ppuConfidentialNumber
        existingStudent.studentPhoto = photoURL
        existingStudent.studentSign = signURL
        existingStudent.part1AdmForm = savedBCAPart1AdmFormDetails._id

        await existingStudent.save();

        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-success"]);
        return res.redirect(`/bca-1-${courseSession}/feeCheckout`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> part1AdmFormPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-1-${courseSession}/admForm`);
    }
}


export const part2AdmForm = async (req, res) => {
    const { courseSession } = req.params;

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .populate("part1AdmForm").populate("part2AdmForm").populate("part3AdmForm")
            .select("-password");

        if (!existingStudent) {
            req.flash("flashMessage", ["Student not found", "alert-danger"]);
            return res.redirect(`/bca-2-${courseSession}/dashboard`);
        }

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });
        console.log(admPortalStatus)

        const data = {
            pageTitle: `BCA Part 2 ${courseSession} Admission Form`,
            activeTab: "Part 2",
            activeTabList: "Part 2 Adm Form",
            course: "bca",
            courseSession,
            existingStudent,
            admPortalStatus
        };

        if (!admPortalStatus || !admPortalStatus.isPart2AdmActive) {
            data.alertStatus = 'Oops! You are late.'
            data.alertDes = `BCA Part 2 (${courseSession}) Admission has been closed.`
            return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
        }

        return res.render("BCA/part2AdmForm", { message: req.flash("flashMessage"), data });

    } catch (error) {
        console.error("Error in part2AdmForm controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-2-${courseSession}/admForm`);
    }
};


export const part2AdmFormPost = async (req, res) => {
    const { courseSession } = req.params
    try {

        const { uniRegNumber, uniRollNumber, examResult, obtMarks, fullMarks, obtPercent } = req.body

        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password')
        if (!existingStudent) throw new Error("Student not found");

        let admissionFee = 15000
        let extraFee = 0
        let totalFee = admissionFee + extraFee

        let examYear =  getLastExamYear(courseSession, 2)

        const BCAPart2AdmFormDetails = new BCAPart2AdmForm({
            courseSession: existingStudent.courseSession, examYear, examResult, obtMarks, fullMarks, obtPercent, appliedBy: existingStudent._id, admissionFee, extraFee, totalFee
        });

        const savedBCAPart2AdmFormDetails = await BCAPart2AdmFormDetails.save();

        existingStudent.uniRegNumber = uniRegNumber
        existingStudent.uniRollNumber = uniRollNumber
        existingStudent.part2AdmForm = savedBCAPart2AdmFormDetails._id

        await existingStudent.save();

        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-success"]);
        return res.redirect(`/bca-2-${courseSession}/feeCheckout`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> part2AdmFormPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-2-${courseSession}/admForm`);
    }
}


export const part3AdmForm = async (req, res) => {
    const { courseSession } = req.params;

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .populate("part1AdmForm").populate("part2AdmForm").populate("part3AdmForm")
            .select("-password");

        if (!existingStudent) {
            req.flash("flashMessage", ["Student not found", "alert-danger"]);
            return res.redirect(`/bca-3-${courseSession}/dashboard`);
        }

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });

        const data = {
            pageTitle: `BCA Part 3 ${courseSession} Admission Form`,
            activeTab: "Part 3",
            activeTabList: "Part 3 Adm Form",
            course: "bca",
            courseSession,
            existingStudent,
            admPortalStatus
        };

        if (!admPortalStatus || !admPortalStatus.isPart3AdmActive) {
            data.alertStatus = 'Oops! You are late.'
            data.alertDes = `BCA Part 3 (${courseSession}) Admission has been closed.`
            return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
        }

        return res.render("BCA/part3AdmForm", { message: req.flash("flashMessage"), data });

    } catch (error) {
        console.error("Error in part3AdmForm controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-3-${courseSession}/admForm`);
    }
};


export const part3AdmFormPost = async (req, res) => {
    const { courseSession } = req.params
    try {

        const { examResult, obtMarks, fullMarks, obtPercent } = req.body

        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password')
        if (!existingStudent) throw new Error("Student not found");

        let admissionFee = 15000
        let extraFee = 0
        let totalFee = admissionFee + extraFee

        let examYear =  getLastExamYear(courseSession, 3)

        const BCAPart3AdmFormDetails = new BCAPart3AdmForm({
            courseSession: existingStudent.courseSession, examYear, examResult, obtMarks, fullMarks, obtPercent, appliedBy: existingStudent._id, admissionFee, extraFee, totalFee
        });

        const savedBCAPart3AdmFormDetails = await BCAPart3AdmFormDetails.save();

        existingStudent.part3AdmForm = savedBCAPart3AdmFormDetails._id

        await existingStudent.save();

        req.flash("flashMessage", ["Form filled successfully, Pay Admission fee.", "alert-success"]);
        return res.redirect(`/bca-3-${courseSession}/feeCheckout`);
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> part3AdmFormPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-3-${courseSession}/admForm`);
    }
}


export const feeCheckout = async (req, res) => {
    const { coursePart, courseSession } = req.params;

    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession })
            .select('-password')
            .populate("part1AdmForm")
            .populate("part2AdmForm")
            .populate("part3AdmForm");

        if (!existingStudent) throw new Error("Student not found");

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });

        const data = {
            pageTitle: `BCA Part ${coursePart} ${courseSession} Admission Fee Checkout`,
            activeTab: `Part ${coursePart}`,
            activeTabList: `Part ${coursePart} Adm Form`,
            existingStudent,
            coursePart,
            admPortalStatus
        };

        // Validate part number
        const part = Number(coursePart);
        if (![1, 2, 3].includes(part)) {
            data.alertStatus = 'Oops! Page not found.';
            data.alertDes = 'Invalid course part.';
            return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
        }

        const admFormKey = `part${part}AdmForm`;
        if (!existingStudent[admFormKey]) {
            data.alertStatus = 'Oops! Page not found.';
            data.alertDes = 'Admission form not filled for this part.';
            return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
        }

        res.render("BCA/checkoutPage", { message: req.flash("flashMessage"), data });

    } catch (error) {
        console.error("Error in feeCheckout controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/bca-${coursePart}-${courseSession}/admForm`);
    }
};



export const admFormCopy = async (req, res) => {
    const { coursePart, courseSession } = req.params;
    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password').populate("part1AdmForm").populate("part2AdmForm").populate("part3AdmForm")
        if (!existingStudent) throw new Error("Student not found");
        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });

        let data = {
            pageTitle: `BCA Part ${coursePart} ${existingStudent.courseSession} Admission Form Copy`,
            activeTab: `Part ${coursePart}`,
            activeTabList: `Part ${coursePart} Adm Form Copy`,
            existingStudent,
            coursePart,
            courseSession,
            admPortalStatus
        }
        if (coursePart == 1) {
            if ( existingStudent.part1AdmForm !== null && existingStudent.part1AdmForm.isPaid ) {
                return res.render("BCA/admFormCopy", { message: req.flash("flashMessage"), data })
            }
        }
        if (coursePart == 2) {
            if ( existingStudent.part2AdmForm !== null && existingStudent.part2AdmForm.isPaid ) {
                return res.render("BCA/admFormCopy", { message: req.flash("flashMessage"), data })
            }
        }
        if (coursePart == 3) {
            if ( existingStudent.part3AdmForm !== null && existingStudent.part3AdmForm.isPaid ) {
                return res.render("BCA/admFormCopy", { message: req.flash("flashMessage"), data })
            }
        }
        data.alertStatus = 'Invalid Course Part';
        data.alertDes = 'Only Part 1 Part 2 and Part 3 Admission form copy are handled.';
        return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> admFormCopy :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-${coursePart}-${courseSession}/admForm`);
    }
}


export const admReceipt = async (req, res) => {
    const { coursePart, courseSession } = req.params;
    try {
        const existingStudent = await BCAStudent.findOne({ _id: req.id, courseSession }).select('-password').populate("part1AdmForm").populate("part2AdmForm").populate("part3AdmForm")
        if (!existingStudent) throw new Error("Student not found");

        const admPortalStatus = await VocationalAdmPortal.findOne({ degree: "bca", courseSession });

        let data = {
            pageTitle: `BCA Part ${coursePart} ${existingStudent.courseSession} Admission Receipt`,
            activeTab: `Part ${coursePart}`,
            activeTabList: `Part ${coursePart} Adm Receipt`,
            existingStudent,
            courseSession,
            coursePart,
            admPortalStatus
        }
        if (coursePart == 1) {
            if ( existingStudent.part1AdmForm !== null && existingStudent.part1AdmForm.isPaid ) {
                return res.render("BCA/admReceipt", { message: req.flash("flashMessage"), data })
            }
        }
        if (coursePart == 2) {
            if ( existingStudent.part2AdmForm !== null && existingStudent.part2AdmForm.isPaid ) {
                return res.render("BCA/admReceipt", { message: req.flash("flashMessage"), data })
            }
        }
        if (coursePart == 3) {
            if ( existingStudent.part3AdmForm !== null && existingStudent.part3AdmForm.isPaid ) {
                return res.render("BCA/admReceipt", { message: req.flash("flashMessage"), data })
            }
        }
        data.alertStatus = 'Invalid Course Part';
        data.alertDes = 'Only Part 1 Part 2 and Part 3 Admission receipt are handled.';
        return res.render("BCA/errorPage", { message: req.flash("flashMessage"), data });
    } catch (error) {
        console.error("Error in Controllers >> Vocational_Course_Controllers >> BCA_Controllers >> admReceipt :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/bca-${coursePart}-${courseSession}/admForm`);
    }
}
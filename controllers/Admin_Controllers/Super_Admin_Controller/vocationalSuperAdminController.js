import AdminModel from "../../../models/adminRoleModels/adminModel.js";
import BCAPart1MeritList from "../../../models/Vocational_Course_Models/BCA_Models/bcaPart1MeritListModel.js";
import VocationalAdmPortal from "../../../models/Vocational_Course_Models/vocationalAdmPortalModel.js";
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dashboard = async (req, res) => {
    try {
        const foundUser = await AdminModel.findById(req.id)
        if (!foundUser) {
            req.flash("flashMessage", ["User not found !!", "alert-danger"])
            return res.redirect(`/login/super-admin`);
        }
        let data = {
            pageTitle: `Super Admin Dashboard`,
            activeTab: "",
            activeTabList: "dashboard",
            foundUser
        }
        res.render("Super_Admin/dashboard", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> login :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/dashboard`);
    }
}

export const bcaAdmission = async (req, res) => {
    try {
        const foundUser = await AdminModel.findById(req.id)
        const admPortalList = await VocationalAdmPortal.find()

        let data = {
            pageTitle: `BCA Admission Portal List`,
            activeTab: "Voc Admission",
            activeTabList: "BCA",
            foundUser,
            admPortalList
        }
        res.render("Super_Admin/bcaAdmission", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> bcaAdmission :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/bcaAdmission`);
    }
}

export const bcaAdmissionPost = async (req, res) => {
    const { courseSession } = req.body;
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    try {
        const foundAdmPortal = await VocationalAdmPortal.findOne({ courseSession, degree: "bca" });

        if (foundAdmPortal) {
            req.flash("flashMessage", ["Admission Portal Already started..", "alert-danger"]);
            return res.redirect(`/super-admin/bcaAdmission`);
        }

        // Convert dOB from "01-Jan-2006" to "2006-01-01T00:00:00.000Z"
        data = data.map(item => {
            if (item.dOB) {
                const parsedDate = new Date(item.dOB);
                if (!isNaN(parsedDate)) {
                    item.dOB = parsedDate.toISOString(); // "2006-01-01T00:00:00.000Z"
                }
            }
            return item;
        });

        await BCAPart1MeritList.deleteMany({});
        await BCAPart1MeritList.insertMany(data);

        const newVocationalAdmPortal = new VocationalAdmPortal({
            courseSession,
            degree: "bca"
        });

        await newVocationalAdmPortal.save();

        req.flash("flashMessage", ["New Admission started successfully.", "alert-success"]);
        return res.redirect(`/super-admin/bcaAdmission`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> bcaAdmissionPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/super-admin/bcaAdmission`);
    }
};


export const portalStatus = async (req, res) => {
    try {
        const { degree, part, portalId } = req.params
        const admPortal = await VocationalAdmPortal.findById(portalId)
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(`/super-admin/${degree}Admission`);
        }

        if (part == 1) {
            admPortal.isPart1Active = !admPortal.isPart1Active,
                admPortal.isPart1AdmActive = !admPortal.isPart1AdmActive
            await admPortal.save()
        }
        if (part == 2) {
            admPortal.isPart2Active = !admPortal.isPart2Active,
                admPortal.isPart2AdmActive = !admPortal.isPart2AdmActive
            await admPortal.save()
        }
        if (part == 3) {
            admPortal.isPart3Active = !admPortal.isPart3Active,
                admPortal.isPart3AdmActive = !admPortal.isPart3AdmActive
            await admPortal.save()
        }
        if (part < 1 || part > 3) {
            req.flash("flashMessage", ["Invalid Part URL !!", "alert-danger"])
            return res.redirect(`/super-admin/${degree}Admission`);
        }
        req.flash("flashMessage", ["Portal status changes !!", "alert-success"])
        res.redirect(`/super-admin/${degree}Admission`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> portalStatus :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/${degree}Admission`);
    }
}


export const portalDetail = async (req, res) => {
    try {
        const { degree, portalId } = req.params
        const foundUser = await AdminModel.findById(req.id)
        const admPortal = await VocationalAdmPortal.findById(portalId)
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(`/super-admin/${degree}Admission`);
        }

        let data = {
            pageTitle: `BCA Portal Admission Detail`,
            activeTab: "Voc Admission",
            activeTabList: "BCA",
            foundUser,
            admPortal
        }
        res.render("Super_Admin/portalDetail", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> portalDetail :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/${degree}Admission`);
    }
}


export const portalAdmStatus = async (req, res) => {
    try {
        const { degree, part, portalId } = req.params
        const admPortal = await VocationalAdmPortal.findById(portalId)
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(`/${degree}/${portalId}`);
        }

        if (part == 1) {
            admPortal.isPart1AdmActive = !admPortal.isPart1AdmActive
            await admPortal.save()
        }
        if (part == 2) {
            admPortal.isPart2AdmActive = !admPortal.isPart2AdmActive
            await admPortal.save()
        }
        if (part == 3) {
            admPortal.isPart3AdmActive = !admPortal.isPart3AdmActive
            await admPortal.save()
        }
        if (part < 1 || part > 3) {
            req.flash("flashMessage", ["Invalid Part URL !!", "alert-danger"])
            return res.redirect(`/${degree}/${portalId}`);
        }
        req.flash("flashMessage", [`Merit List Upadted for ${degree.toUpperCase()}`, "alert-success"])
        res.redirect(`/${degree}/${portalId}`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> portalAdmStatus :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/${degree}Admission`);
    }
}


export const updateMeritList = async (req, res) => {
    const { degree } = req.params
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    try {

        // Convert dOB from "01-Jan-2006" to "2006-01-01T00:00:00.000Z"
        data = data.map(item => {
            if (item.dOB) {
                const parsedDate = new Date(item.dOB);
                if (!isNaN(parsedDate)) {
                    item.dOB = parsedDate.toISOString(); // "2006-01-01T00:00:00.000Z"
                }
            }
            return item;
        });

        if (degree === 'bca') {
            await BCAPart1MeritList.deleteMany({});
            await BCAPart1MeritList.insertMany(data);
        }

        req.flash("flashMessage", ["New Admission started successfully.", "alert-success"]);
        return res.redirect(`/super-admin/${degree}Admission`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> updateMeritList :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/super-admin/${degree}Admission`);
    }
};


export const deletePortal = async (req, res) => {
    try {
        const { degree, portalId } = req.params
        const admPortal = await VocationalAdmPortal.findOneAndDelete({_id: portalId})
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(`/super-admin/${degree}Admission`);
        }

        req.flash("flashMessage", [`Admission Portal Deleted`, "alert-success"])
        return res.redirect(`/super-admin/${degree}Admission`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> vocationalSuperAdminController >> deletePortal :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/super-admin/${degree}Admission`);
    }
}

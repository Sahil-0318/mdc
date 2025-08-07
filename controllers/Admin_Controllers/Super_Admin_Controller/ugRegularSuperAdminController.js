import AdminModel from "../../../models/adminRoleModels/adminModel.js";
import UgRegularPortalStatus from "../../../models/Ug_Regular_Course_Models/portalStatus.js";
import UgRegularMeritList from "../../../models/Ug_Regular_Course_Models/meritList.js";

import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);

export const ugRegularAdmission_SA = async (req, res) => {
    try {
        const foundUser = await AdminModel.findById(req.id)
        if (!foundUser) {
            req.flash("flashMessage", ["User not found !!", "alert-danger"])
            return res.redirect(`/login/super-admin`);
        }
        const admPortalList = await UgRegularPortalStatus.find()
        let data = {
            pageTitle: `New UG Regular Admission`,
            activeTab: "",
            activeTabList: "ugRegularAdmission",
            foundUser,
            admPortalList
        }
        res.render("Super_Admin/ugRegularAdmission", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularAdmission_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(req.get("referer"));
    }
}

export const ugRegularAdmissionPost_SA = async (req, res) => {
    try {
        const { courseSession, sem } = req.body;

        // Check for duplicate session
        const existingPortal = await UgRegularPortalStatus.findOne({ courseSession });
        if (existingPortal) {
            req.flash("flashMessage", ["Admission Portal Already started..", "alert-danger"]);
            return res.redirect(req.get("referer"));
        }

        // Initialize dynamic field names
        const semNum = sem.split("-")[1]; // Extract '1' from 'Sem-1'
        const semPortalKey = `sem${semNum}Portal`;
        const semAdmPortalKey = `sem${semNum}AdmPortal`;

        let insertData = {};

        // Only for Sem-1: read Excel
        if (sem === "Sem-1") {
            if (!req.file) {
                req.flash("flashMessage", ["Merit list file required for Sem-1", "alert-danger"]);
                return res.redirect("/super-admin/ug-regular-admission");
            }

            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // If you want to do something with 'data', do it here
            await UgRegularMeritList.deleteMany({});
            await UgRegularMeritList.insertMany(data);

            // Clean up the uploaded file
            await fs.unlink(filePath);
        }

        // Set active status for selected semester
        insertData = {
            courseSession,
            [semPortalKey]: true,
            [semAdmPortalKey]: true
        };

        const newPortal = new UgRegularPortalStatus(insertData);
        await newPortal.save();

        req.flash("flashMessage", ["New Admission started successfully.", "alert-success"]);
        return res.redirect("/super-admin/ug-regular-admission");

    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularAdmissionPost_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(req.get("referer"));
    }
};


export const updatePortalStatus = async (req, res) => {
    try {
        const { sem, portalId } = req.params;
        const semester = parseInt(sem);

        if (semester < 1 || semester > 8) {
            req.flash("flashMessage", ["Invalid Semester URL !!", "alert-danger"]);
            return res.redirect(req.get("referer"));
        }

        const admPortal = await UgRegularPortalStatus.findById(portalId);
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"]);
            return res.redirect(req.get("referer"));
        }

        // Toggle portal status dynamically
        const portalKey = `sem${semester}Portal`;
        const admPortalKey = `sem${semester}AdmPortal`;

        admPortal[portalKey] = !admPortal[portalKey];
        admPortal[admPortalKey] = admPortal[portalKey] ? 'true' : 'false';

        await admPortal.save();

        req.flash("flashMessage", [`Semester ${semester} portal status updated.`, "alert-success"]);
        return res.redirect(req.get("referer"));
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> updatePortalStatus :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(req.get("referer"));
    }
};


export const updateAdmPortalStatus = async (req, res) => {
    try {
        const { sem, portalId } = req.params;
        const semester = parseInt(sem);

        const validSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
        if (!validSemesters.includes(semester)) {
            req.flash("flashMessage", ["Invalid Semester URL !!", "alert-danger"]);
            return res.redirect(req.get("referer"));
        }

        const admPortal = await UgRegularPortalStatus.findById(portalId);
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"]);
            return res.redirect(req.get("referer"));
        }

        const semPortalKey = `sem${semester}Portal`;
        const semAdmPortalKey = `sem${semester}AdmPortal`;

        if (!admPortal[semPortalKey]) {
            req.flash("flashMessage", [`Semester ${semester} Portal is De-active. Please activate it first.`, "alert-warning"]);
            return res.redirect(req.get("referer"));
        }

        // Toggle admission portal status
        admPortal[semAdmPortalKey] = !admPortal[semAdmPortalKey]
        await admPortal.save();

        req.flash("flashMessage", [`Semester ${semester} Admission Portal status updated.`, "alert-success"]);
        return res.redirect(req.get("referer"));
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> updateAdmPortalStatus :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(req.get("referer"));
    }
};


export const portalDetail = async (req, res) => {
    try {
        const { portalId } = req.params
        const foundUser = await AdminModel.findById(req.id)
        const admPortal = await UgRegularPortalStatus.findById(portalId)
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(`/super-admin/ug-regular-admission`);
        }

        let data = {
            pageTitle: `UG Regular Admission Portal Detail`,
            activeTab: "",
            activeTabList: "ugRegularAdmission",
            foundUser,
            admPortal
        }
        res.render("Super_Admin/ugPortalDetail", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> portalDetail :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(req.get("referer"));
    }
};



export const ugRegularUpdateMeritList_SA = async (req, res) => {
    try {
        const foundUser = await AdminModel.findById(req.id)
        const meritListData = await UgRegularMeritList.find({})

        let data = {
            pageTitle: `New UG Regular Admission`,
            activeTab: "",
            activeTabList: "ugRegularAdmission",
            foundUser,
            meritListData
        }
        res.render("Super_Admin/updateMeritList", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularUpdateMeritList_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(req.get("referer"));
    }
}


export const ugRegularUpdateMeritListPost_SA = async (req, res) => {

    try {
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // If you want to do something with 'data', do it here
        await UgRegularMeritList.deleteMany({});
        await UgRegularMeritList.insertMany(data);

        // Clean up the uploaded file
        await fs.unlink(filePath);

        req.flash("flashMessage", ["Merit List Updated successfully.", "alert-success"]);
        return res.redirect(req.get("referer"));
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularUpdateMeritListPost_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        try {
            await fs.unlink(filePath); // ❗Clean up even on error
        } catch (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
        }
        return res.redirect(req.get("referer"));
    }
};


export const ugRegularDeletePortal_SA = async (req, res) => {
    try {
        const { portalId } = req.params
        const admPortal = await UgRegularPortalStatus.findOneAndDelete({ _id: portalId })
        if (!admPortal) {
            req.flash("flashMessage", ["Portal not found !!", "alert-danger"])
            return res.redirect(req.get("referer"));
        }

        req.flash("flashMessage", [`Admission Portal Deleted`, "alert-success"])
        return res.redirect("/super-admin/ug-regular-admission");
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularDeletePortal_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(req.get("referer"));
    }
}
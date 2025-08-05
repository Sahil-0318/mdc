import AdminModel from "../../../models/adminRoleModels/adminModel.js";
import UgRegularPortalStatus from "../../../models/Ug_Regular_Course_Models/portalStatus.js";
import UgRegularMeritList from "../../../models/Ug_Regular_Course_Models/meritList.js";

export const ugRegularAdmission_SA = async (req, res) => {
    try {
        const foundUser = await AdminModel.findById(req.id)
        if (!foundUser) {
            req.flash("flashMessage", ["User not found !!", "alert-danger"])
            return res.redirect(`/login/super-admin`);
        }
        let data = {
            pageTitle: `New UG Regular Admission`,
            activeTab: "",
            activeTabList: "ugRegularAdmission",
            foundUser
        }
        res.render("Super_Admin/ugRegularAdmission", { message: req.flash("flashMessage"), data })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Super_Admin_Controller >> ugRegularSuperAdminController >> ugRegularAdmission_SA :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect("back");
    }
}

export const ugRegularAdmissionPost_SA = async (req, res) => {
    try {
        const { courseSession, sem } = req.body;

        // Check for duplicate session
        const existingPortal = await UgRegularPortalStatus.findOne({ courseSession });
        if (existingPortal) {
            req.flash("flashMessage", ["Admission Portal Already started..", "alert-danger"]);
            return res.redirect("/super-admin/ug-regular-admission");
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
        console.error("Error in ugRegularAdmissionPost_SA:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect("back");
    }
};
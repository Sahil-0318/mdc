import Grievance from "../../../models/adminModel/grievance.js";
import User from "../../../models/userModel/userSchema.js"


export const grievanceList = async (req, res) => {
    try {
        // Find the user based on request ID
        const user = await User.findOne({ _id: req.id });
        const grievances = await Grievance.find();

        let data = {
            pageTitle: `Grievance List`,
            grievances
        }

        res.render('Admin/grievanceList', { message: req.flash("flashMessage"), data, user })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> grievanceController >> grievanceList :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/admin/grievance-list`);
    }
}


export const grievanceView = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id });
        const grievance = await Grievance.findById(req.params.id);
        if (!grievance) {
            req.flash("flashMessage", ["Grievance not found !!", "alert-danger"]);
            return res.redirect("/admin/grievance-list");
        }

        let data = {
            pageTitle: `Grievance Detail`,
            grievance
        }

        res.render('Admin/viewGrievance', { message: req.flash("flashMessage"), data, user })
    } catch (error) {
        console.error("Error loading grievance view:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect("/admin/grievance-list");
    }
};


export const grievanceStatusChange = async (req, res) => {
    try {
        const grievanceId = req.params.id;
        const newStatus = req.body.status;

        await Grievance.findByIdAndUpdate(grievanceId, { status: newStatus });

        res.redirect("back"); // or redirect to a specific page
    } catch (error) {
        console.error("Error in grievanceStatusChange:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        res.redirect("/admin/grievance-list");
    }
};

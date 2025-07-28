import User from "../../../models/userModel/userSchema.js"
import BCAStudent from "../../../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js";
import VocationalAdmPortal from "../../../models/Vocational_Course_Models/vocationalAdmPortalModel.js";
import { Parser } from 'json2csv';


import BCAPart1AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part1AdmFormModel.js";
import BCAPart2AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part2AdmFormModel.js";
import BCAPart3AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part3AdmFormModel.js";


export const bcaAdm = async (req, res) => {
    const { courseSession } = req.params
    try {
        // Find the user based on request ID
        const user = await User.findOne({ _id: req.id });
        const foundPortal = await VocationalAdmPortal.findOne({ courseSession, degree: "bca" });

        let data = {
            pageTitle: `BCA ${courseSession} Admission`,
            courseSession,
            foundPortal
        }

        res.render('Admin/bcaAdm', { message: req.flash("flashMessage"), data, user })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> vocationalAdminController >> bcaAdm :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/admin/bca-${courseSession}`);
    }
}


export const bcaAdmPartList = async (req, res) => {
  const { courseSession, coursePart } = req.params;

  try {
    if (coursePart < 1 || coursePart > 3) {
      req.flash("flashMessage", ["Invalid Course Part", "alert-danger"]);
      return res.redirect(`/admin/bca-${courseSession}`);
    }

    const data = {
      pageTitle: `BCA ${courseSession} Part ${coursePart} Admission List`,
      courseSession,
      coursePart
    };

    const user = await User.findOne({ _id: req.id });

    const partField = `part${coursePart}AdmForm`;

    // Find students with the specific part form not null AND collegeRollNo not null
    const students = await BCAStudent.find({
      [partField]: { $ne: null },
      collegeRollNo: { $ne: null }
    }).populate(partField);

    // Sort students by collegeRollNo
    data.students = students.sort((a, b) => {
      return a.collegeRollNo.localeCompare(b.collegeRollNo, undefined, { numeric: true });
    });

    res.render("Admin/bcaAdmPartList", {
      message: req.flash("flashMessage"),
      data,
      user
    });
  } catch (error) {
    console.error("Error in bcaAdmPartList:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}`);
  }
};



export const excelDownload = async (req, res) => {
  const { courseSession, coursePart } = req.params;

  try {
    // Select the correct model based on coursePart
    let AdmFormModel;
    if (coursePart === "1") {
      AdmFormModel = BCAPart1AdmForm;
    } else if (coursePart === "2") {
      AdmFormModel = BCAPart2AdmForm;
    } else if (coursePart === "3") {
      AdmFormModel = BCAPart3AdmForm;
    } else {
      req.flash("flashMessage", ["Invalid Course Part", "alert-danger"]);
      return res.redirect(`/admin/bca-${courseSession}`);
    }

    const students = await AdmFormModel.find({ courseSession, isPaid: true })
      .populate("appliedBy");

    // Sort by College Roll No. (valid ones first)
    const sortedStudents = students.sort((a, b) => {
      const rollA = a.appliedBy?.collegeRollNo;
      const rollB = b.appliedBy?.collegeRollNo;

      if (rollA && rollB) return rollA - rollB;
      if (!rollA && rollB) return 1;
      if (rollA && !rollB) return -1;
      return 0;
    });

    const users = sortedStudents.map((admUser) => {
      const {
        appliedBy,
        receiptNo,
        paymentScreenshot,
        paymentId,
        dateAndTimeOfPayment,
        totalFee,
      } = admUser;

      const row = {
        "College Roll No.": appliedBy?.collegeRollNo || "",
        "Student Name": appliedBy?.studentName,
        "Reference No.": appliedBy?.referenceNumber || "",
        "Course": "BCA",
        "Session": appliedBy?.courseSession || courseSession,
        "Aadhar No.": appliedBy?.aadharNumber || "",
        "DOB": appliedBy?.dOB || "",
        "Gender": appliedBy?.gender || "",
        "Category": appliedBy?.category || "",
        "Subject": appliedBy?.subject || "",
        "Father's Name": appliedBy?.fatherName || "",
        "Mother's Name": appliedBy?.motherName || "",
        "Address": `ADDRESS - ${appliedBy?.address || ""}, DISTRICT - ${appliedBy?.district || ""}, P.S - ${appliedBy?.policeStation || ""}, ${appliedBy?.state || ""}, PIN - ${appliedBy?.pinCode || ""}`,
        "Mobile No.": appliedBy?.mobileNumber || "",
        "Email": appliedBy?.email || "",
        "Admission Fee": totalFee || "",
        "Student's Photo": appliedBy?.studentPhoto || "",
        "Student's Sign": appliedBy?.studentSign || "",
        "Payment Receipt No.": receiptNo || "",
        "Admission Date": dateAndTimeOfPayment || "",
        "Payment Id": paymentId || "",
        "Payment SS": paymentScreenshot || ""
      };

      // Add university fields for Part 2 and Part 3
      if (coursePart === "2" || coursePart === "3") {
        row["University Roll No."] = appliedBy?.uniRollNumber || "";
        row["University Reg. No."] = appliedBy?.uniRegNumber || "";
      }

      return row;
    });

    const csvParser = new Parser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=BCA_Part_${coursePart}_${courseSession}_Adm_List.csv`
    );
    return res.status(200).end(csvData);
  } catch (error) {
    console.error("Error in excelDownload:", error);
    req.flash("flashMessage", ["Something went wrong while generating Excel!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}`);
  }
};


export const studentDetail = async (req, res) => {
  const { courseSession, coursePart } = req.params;

  try {
    if (coursePart < 1 || coursePart > 3) {
      req.flash("flashMessage", ["Invalid Course Part", "alert-danger"]);
      return res.redirect(`/admin/bca-${courseSession}`);
    }

    const data = {
      pageTitle: `BCA ${courseSession} Part ${coursePart} Admission List`,
      courseSession,
      coursePart
    };

    const user = await User.findOne({ _id: req.id });

    const partField = `part${coursePart}AdmForm`;

    // Find students with the specific part form not null AND collegeRollNo not null
    const students = await BCAStudent.find({
      [partField]: { $ne: null },
      collegeRollNo: { $ne: null }
    }).populate(partField);

    // Sort students by collegeRollNo
    data.students = students.sort((a, b) => {
      return a.collegeRollNo.localeCompare(b.collegeRollNo, undefined, { numeric: true });
    });

    res.render("Admin/bcaAdmPartList", {
      message: req.flash("flashMessage"),
      data,
      user
    });
  } catch (error) {
    console.error("Error in studentDetail:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}`);
  }
};



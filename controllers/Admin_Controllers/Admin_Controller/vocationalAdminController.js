import User from "../../../models/userModel/userSchema.js"
import BCAStudent from "../../../models/Vocational_Course_Models/BCA_Models/bcaStudentModel.js";
import VocationalAdmPortal from "../../../models/Vocational_Course_Models/vocationalAdmPortalModel.js";
import { Parser } from 'json2csv';


import BCAPart1AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part1AdmFormModel.js";
import BCAPart2AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part2AdmFormModel.js";
import BCAPart3AdmForm from "../../../models/Vocational_Course_Models/BCA_Models/part3AdmFormModel.js";


export const bcaAdmList = async (req, res) => {
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });
    const foundPortal = await VocationalAdmPortal.find({ degree: "bca" });

    let data = {
      pageTitle: `All BCA Admission List`,
      foundPortal
    }

    res.render('Admin/bcaAdmList', { message: req.flash("flashMessage"), data, user })
  } catch (error) {
    console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> vocationalAdminController >> bcaAdmList :", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
    return res.redirect(`/admin/bca-adm-list`);
  }
}

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
      pageTitle: `BCA Part ${coursePart} ${courseSession} Admission List`,
      courseSession,
      coursePart
    };

    const user = await User.findOne({ _id: req.id });

    // Dynamically select model
    const FormModels = {
      1: BCAPart1AdmForm,
      2: BCAPart2AdmForm,
      3: BCAPart3AdmForm
    };

    const SelectedModel = FormModels[coursePart];
    if (!SelectedModel) {
      req.flash("flashMessage", ["Form Model not found", "alert-danger"]);
      return res.redirect(`/admin/bca-${courseSession}`);
    }

    const students = await SelectedModel.find({ courseSession }).populate({
      path: "appliedBy",
      select: "-password"
    });

    // Sort by collegeRollNo inside appliedBy
    data.students = students.sort((a, b) => {
      if (!a.appliedBy?.collegeRollNo) return 1;
      if (!b.appliedBy?.collegeRollNo) return -1;
      return a.appliedBy.collegeRollNo.localeCompare(b.appliedBy.collegeRollNo, undefined, { numeric: true });
    });

    res.render("Admin/bcaAdmPartList", {
      message: req.flash("flashMessage"),
      data,
      user
    });
  } catch (error) {
    console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> vocationalAdminController >> bcaAdmPartList:", error);
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
    console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> vocationalAdminController >> excelDownload:", error);
    req.flash("flashMessage", ["Something went wrong while generating Excel!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}`);
  }
};


export const studentDetail = async (req, res) => {
  const { courseSession, coursePart, studentId } = req.params;
  const partNumber = Number(coursePart);

  if (![1, 2, 3].includes(partNumber)) {
    req.flash("flashMessage", ["Invalid Course Part", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
  }

  try {
    const user = await User.findById(req.id);

    const student = await BCAStudent.findById(studentId)
      .select("-password")
      .populate("part1AdmForm")
      .populate("part2AdmForm")
      .populate("part3AdmForm");

    const data = {
      pageTitle: `BCA Part ${partNumber} ${courseSession} Student Details`,
      courseSession,
      coursePart: partNumber,
      student
    };

    res.render("Admin/bcaStudentDetail", {
      message: req.flash("flashMessage"),
      data,
      user
    });
  } catch (error) {
    console.error("Error in studentDetail controller:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
  }
};



export const studentEdit = async (req, res) => {
  const { courseSession, coursePart, studentId } = req.params;

  try {
    const part = parseInt(coursePart);
    if (![1, 2, 3].includes(part)) {
      req.flash("flashMessage", ["Invalid Course Part", "alert-danger"]);
      return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
    }

    const user = await User.findById(req.id).lean();

    const student = await BCAStudent.findById(studentId)
      .select("-password")
      .populate("part1AdmForm")
      .populate("part2AdmForm")
      .populate("part3AdmForm")
      .lean();

    if (!student) {
      req.flash("flashMessage", ["Student not found", "alert-warning"]);
      return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
    }

    const data = {
      pageTitle: `Edit Student Details BCA Part ${part} ${courseSession}`,
      courseSession,
      coursePart: part,
      student,
    };

    res.render("Admin/bcaStudentEdit", {
      message: req.flash("flashMessage"),
      data,
      user,
    });
  } catch (error) {
    console.error("Error in studentEdit:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
  }
};



export const studentEditPost = async (req, res) => {
  const { courseSession, coursePart, studentId } = req.params;
  const {
    studentName, referenceNumber, applicantId, ppuConfidentialNumber, collegeRollNo,
    uniRegNumber, uniRollNumber, email, mobileNumber, dOB, gender, category,
    subject, fatherName, motherName, guardianName, aadharNumber, bloodGroup,
    familyAnnualIncome, maritalStatus, physicallyChallenged, religion,
    address, district, policeStation, state, pinCode,
    examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent,
    totalFee, paymentId, receiptNo
  } = req.body;

  try {
    // Update common student info
    await BCAStudent.findByIdAndUpdate(studentId, {
      studentName, referenceNumber, applicantId, ppuConfidentialNumber, collegeRollNo,
      uniRegNumber, uniRollNumber, email, mobileNumber, dOB, gender, category,
      subject, fatherName, motherName, guardianName, aadharNumber, bloodGroup,
      familyAnnualIncome, maritalStatus, physicallyChallenged, religion,
      address, district, policeStation, state, pinCode
    }, { new: true });

    // Define part-specific models
    const partForms = {
      1: BCAPart1AdmForm,
      2: BCAPart2AdmForm,
      3: BCAPart2AdmForm // If Part 3 uses the same model as Part 2
    };

    // Update admission form for the current part
    const AdmFormModel = partForms[coursePart];
    if (AdmFormModel) {
      await AdmFormModel.findOneAndUpdate({ appliedBy: studentId }, {
        examName, examBoard, examYear, examResult,
        obtMarks, fullMarks, obtPercent,
        totalFee, paymentId, receiptNo
      }, { new: true });
    }

    req.flash("flashMessage", ["Student data updated successfully!", "alert-success"]);
    return res.redirect(`/admin/bca-${courseSession}/part-${coursePart}-student-detail/${studentId}`);
  } catch (error) {
    console.error("Error in studentEditPost:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(`/admin/bca-${courseSession}/${coursePart}`);
  }
};


export const studentCredentials = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await BCAStudent
      .find({})
      .select('userId password courseSession mobileNumber studentName');

    res.render("Admin/bcaStudentCredentials", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })
  } catch (error) {
    console.error("Error in studentCredentials:", error);
    req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
    return res.redirect(req.originalUrl);
  }
};




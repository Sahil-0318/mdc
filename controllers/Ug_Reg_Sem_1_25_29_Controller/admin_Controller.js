import User from "../../models/userModel/userSchema.js"
import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"
import Ug_reg_sem_1_25_29_adm_form from "../../models/Ug_Reg_Sem_1_25_29_Models/adm_Form.js"

import Csv from 'json2csv'
const CsvParser = Csv.Parser

export const ugRegSem1_25_29Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await Ug_Reg_Sem_1_25_29_User.find({})
    res.render("Ug_Reg_Sem_1_25_29/passwordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29Password", error)
  }
}


export const ugRegSem1_25_29List = async (req, res) => {
  const filterQueries = req.query;
  try {
    // Find the user based on request ID
    const user = await User.findOne({ _id: req.id });

    // Initialize the query object
    const query = {};
    let status = "All"

    // Construct the query object based on filterQueries
    if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
      query.isPaid = filterQueries.isPaid === 'true';
      if (query.isPaid == true) {
        status = "Paid"
      } else {
        status = "Unpaid"
      }
    }
    if (filterQueries.category && filterQueries.category !== 'all') {
      query.category = filterQueries.category;
      status += " " + query.category
    }
    if (filterQueries.gender && filterQueries.gender !== 'all') {
      query.gender = filterQueries.gender;
      status += " " + query.gender
    }

    // Find students based on the constructed query
    const ugRegularSem1AdmissionList = await Ug_reg_sem_1_25_29_adm_form.find(query)
    // console.log(ugRegularSem1AdmissionList);
    res.render('Ug_Reg_Sem_1_25_29/admList', { list: ugRegularSem1AdmissionList, status, noOfForms: ugRegularSem1AdmissionList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29List", error)
  }
}


export const ugRegSem1_25_29StudentDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundAdmForm = await Ug_reg_sem_1_25_29_adm_form.findOne({ _id: stuId })
    const foundStudent = await Ug_Reg_Sem_1_25_29_User.findOne({ _id: foundAdmForm.appliedBy })

    res.render('Ug_Reg_Sem_1_25_29/admStudentDetails', { foundAdmForm, foundStudent, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29StudentDetails", error)
  }
}


export const ugRegSem1_25_29EditStudentDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundAdmForm = await Ug_reg_sem_1_25_29_adm_form.findOne({ _id: stuId })
    const foundStudent = await Ug_Reg_Sem_1_25_29_User.findOne({ _id: foundAdmForm.appliedBy })

    res.render('Ug_Reg_Sem_1_25_29/editStudentDetails', { foundAdmForm, foundStudent, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29EditStudentDetails", error)
  }
}


export const ugRegSem1_25_29EditStudentDetailsPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, referenceNumber, ppuConfidentialNumber, applicantId, course, email, paper1, paper2, paper3, paper4, paper5, paper6, dOB, gender, category, religion, familyAnnualIncome, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { stuId } = req.params

    if (gender === "MALE") {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2880
        } else if (category === "BC-1") {
          admissionFee = 2280
        } else {
          admissionFee = 1200
        }
      } else {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2280
        } else if (category === "BC-1") {
          admissionFee = 1680
        } else {
          admissionFee = 600
        }
      }

    } else {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        admissionFee = 625
      } else {
        admissionFee = 25
      }
    }

    await Ug_reg_sem_1_25_29_adm_form.findOneAndUpdate({ _id: stuId }, { $set: { studentName, fatherName, motherName, guardianName, referenceNumber, ppuConfidentialNumber, applicantId, email, paper1, paper2, paper3, paper4, paper5, paper6, dOB, gender, category, religion, familyAnnualIncome, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examName, examBoard, examYear, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await Ug_reg_sem_1_25_29_adm_form.findOne({ _id: stuId })
    await Ug_Reg_Sem_1_25_29_User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { course, referenceNumber, mobileNumber } })

    res.redirect('/ug-reg-sem-1-25-29-list')

  } catch (error) {
    console.log("Error in ugRegSem1_25_29EditStudentDetailsPost", error)
  }
}


export const ugRegSem1_25_29AllExcelsheet = async (req, res) => {
  try {
    const userData = await Ug_reg_sem_1_25_29_adm_form.find({ isPaid: true })

    // console.log(userData.length);

    const socialSubjects = new Set(["Economics", "History", "Political Science", "Psychology", "Sociology"]);
    const humanitiesSubjects = new Set(["English", "Hindi", "Urdu", "Philosophy"]);

    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category,
        aadharNumber, mobileNumber, address, district, policeStation, state, pinCode,
        paper1, paper2, paper3, paper4, paper5, paper6,
        ppuConfidentialNumber, studentPhoto, studentSign,
        session, collegeRollNo, paymentSS, dateAndTimeOfPayment,
        receiptNo, admissionFee
      } = admUser;

      let course = "Bachelor of Science";
      if (socialSubjects.has(paper1)) {
        course = "Bachelor of Arts (Social Science Subjects)";
      } else if (humanitiesSubjects.has(paper1)) {
        course = "Bachelor of Arts (Humanities Subjects)";
      }

      return {
        'Student Name': studentName,
        'College Roll No.': collegeRollNo?.slice(2) || "",
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment?.slice(0, 10) || "",
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_I_All_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem1_25_29AllExcelsheet", error);
    res.redirect('/ug-reg-sem-1-25-29-list');
  }
};



export const ugRegSem1_25_29BAExcelsheet = async (req, res) => {
  try {
    const baSubjects = [
      "Economics", "History", "Political Science", "Psychology",
      "Sociology", "English", "Hindi", "Urdu", "Philosophy"
    ];

    // const userData = await Ug_reg_sem_1_25_29_adm_form.find({
    //   isPaid: true,
    //   paper1: { $in: baSubjects }
    // }).sort({ collegeRollNo: 1 }); // sort in DB for efficiency

    const userData = await Ug_reg_sem_1_25_29_adm_form.find({
      isPaid: true,
      paper1: { $in: baSubjects }
    });

    userData.sort((a, b) => {
      const rollA = parseInt(a.collegeRollNo?.replace(/\D/g, "") || "0", 10);
      const rollB = parseInt(b.collegeRollNo?.replace(/\D/g, "") || "0", 10);
      return rollA - rollB;
    });


    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, referenceNumber, email, dOB, gender,
        category, aadharNumber, mobileNumber, address, district, policeStation,
        state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6,
        ppuConfidentialNumber, studentPhoto, studentSign,
        session, collegeRollNo, paymentSS, dateAndTimeOfPayment,
        receiptNo, admissionFee
      } = admUser;

      const socialSubjects = ["Economics", "History", "Political Science", "Psychology", "Sociology"];
      const humanitiesSubjects = ["English", "Hindi", "Urdu", "Philosophy"];

      const course = socialSubjects.includes(paper1)
        ? "Bachelor of Arts (Social Science Subjects)"
        : humanitiesSubjects.includes(paper1)
          ? "Bachelor of Arts (Humanities Subjects)"
          : "Bachelor of Science";

      return {
        'Student Name': studentName,
        'College Roll No.': collegeRollNo?.slice(2) || "",
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment?.slice(0, 10) || "",
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_I_BA_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem1_25_29BAExcelsheet:", error);
    res.redirect('/ug-reg-sem-1-25-29-list');
  }
};



export const ugRegSem1_25_29BScExcelsheet = async (req, res) => {
  try {
    const bscSubjects = ["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"];

    // Fetch without sorting
    const userData = await Ug_reg_sem_1_25_29_adm_form.find({
      isPaid: true,
      paper1: { $in: bscSubjects }
    });

    // Sort manually by numeric part of collegeRollNo
    userData.sort((a, b) => {
      const rollA = parseInt(a.collegeRollNo?.replace(/\D/g, "") || "0", 10);
      const rollB = parseInt(b.collegeRollNo?.replace(/\D/g, "") || "0", 10);
      return rollA - rollB;
    });

    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category,
        aadharNumber, mobileNumber, address, district, policeStation, state, pinCode,
        paper1, paper2, paper3, paper4, paper5, paper6,
        ppuConfidentialNumber, studentPhoto, studentSign,
        session, collegeRollNo, paymentSS, dateAndTimeOfPayment,
        receiptNo, admissionFee
      } = admUser;

      return {
        'Student Name': studentName,
        'College Roll No.': collegeRollNo?.slice(2) || "",
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course': "Bachelor of Science",
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1': paper1,
        'MIC-1': paper2,
        'MDC-1': paper3,
        'AEC-1': paper4,
        'SEC-1': paper5,
        'VAC-1': paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment?.slice(0, 10) || "",
        "Payment SS": paymentSS
      };
    });

    // Generate CSV
    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_I_BSc_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem1_25_29BScExcelsheet:", error);
    res.redirect('/ug-reg-sem-1-25-29-list');
  }
};

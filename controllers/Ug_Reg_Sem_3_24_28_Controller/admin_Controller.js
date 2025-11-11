import User from "../../models/userModel/userSchema.js"
import Ug_Reg_Sem_3_24_28_User from "../../models/UG-Regular-Sem-3-24-28/user.js"
import Ug_reg_sem_3_24_28_adm_form from "../../models/UG-Regular-Sem-3-24-28/admForm.js"

import Csv from 'json2csv'
const CsvParser = Csv.Parser

export const ugRegSem3_24_28Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await Ug_Reg_Sem_3_24_28_User.find({})
    res.render("Ug_Reg_Sem_3_24_28/passwordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem3_24_28Password", error)
  }
}

export const ugRegSem3_24_28List = async (req, res) => {
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
    const ugRegularSem3AdmissionList = await Ug_reg_sem_3_24_28_adm_form.find(query)
    // console.log(ugRegularSem3AdmissionList);
    res.render('Ug_Reg_Sem_3_24_28/admList', { list: ugRegularSem3AdmissionList, status, noOfForms: ugRegularSem3AdmissionList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem3_24_28List", error)
  }
}

export const ugRegSem3_24_28StudentDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundAdmForm = await Ug_reg_sem_3_24_28_adm_form.findOne({ _id: stuId })
    const foundStudent = await Ug_Reg_Sem_3_24_28_User.findOne({ _id: foundAdmForm.appliedBy })

    res.render('Ug_Reg_Sem_3_24_28/admStudentDetails', { foundAdmForm, foundStudent, user })

  } catch (error) {
    console.log("Error in ugRegSem3_24_28StudentDetails", error)
  }
}

export const ugRegSem3_24_28EditStudentDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundAdmForm = await Ug_reg_sem_3_24_28_adm_form.findOne({ _id: stuId })
    const foundStudent = await Ug_Reg_Sem_3_24_28_User.findOne({ _id: foundAdmForm.appliedBy })

    res.render('Ug_Reg_Sem_3_24_28/editStudentDetails', { foundAdmForm, foundStudent, user })

  } catch (error) {
    console.log("Error in ugRegSem3_24_28EditStudentDetails", error)
  }
}

export const ugRegSem3_24_28EditStudentDetailsPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { stuId } = req.params

    if (gender === "MALE") {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2905
        } else if (category === "BC-1") {
          admissionFee = 2905
        } else {
          admissionFee = 1500
        }
      } else {
        if (category === "GENERAL" || category === "BC-2") {
          admissionFee = 2305
        } else if (category === "BC-1") {
          admissionFee = 2305
        } else {
          admissionFee = 900
        }
      }

    } else {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
        admissionFee = 1500
      } else {
        admissionFee = 900
      }
    }

    await Ug_reg_sem_3_24_28_adm_form.findOneAndUpdate({ _id: stuId }, { $set: { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await Ug_reg_sem_3_24_28_adm_form.findOne({ _id: stuId })
    await Ug_Reg_Sem_3_24_28_User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, course, email, mobileNumber } })

    res.redirect('/ug-reg-sem-3-24-28-list')

  } catch (error) {
    console.log("Error in ugRegSem3_24_28EditStudentDetailsPost", error)
  }
}

export const ugRegSem3_24_28AllExcelsheet = async (req, res) => {
  try {
    const userData = await Ug_reg_sem_3_24_28_adm_form.find({ isPaid: true })

    // console.log(userData.length);

    const socialSubjects = new Set(["Economics", "History", "Political Science", "Psychology", "Sociology"]);
    const humanitiesSubjects = new Set(["English", "Hindi", "Urdu", "Philosophy"]);

    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category,
        aadharNumber, mobileNumber, address, district, policeStation, state, pinCode,
        paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign,
        session, paymentSS, dateAndTimeOfPayment,
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
        'College Roll No.': collegeRollNumber,
        'Uni Roll Number': uniRollNumber,
        'Uni Reg Number': uniRegNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-III & MJC-IV': paper1,
        'MIC-III': paper2,
        'MDC-III': paper3,
        'AEC-III': paper4,
        'SEC-III': paper5,
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
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_II_All_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem3_24_28AllExcelsheet", error);
    res.redirect('/ug-reg-sem-3-24-28-list');
  }
};

export const ugRegSem3_24_28BAExcelsheet = async (req, res) => {
  try {
    const baSubjects = [
      "Economics", "History", "Political Science", "Psychology",
      "Sociology", "English", "Hindi", "Urdu", "Philosophy"
    ];

    // const userData = await Ug_reg_sem_5_23_27_adm_form.find({
    //   isPaid: true,
    //   paper1: { $in: baSubjects }
    // }).sort({ collegeRollNo: 1 }); // sort in DB for efficiency

    const userData = await Ug_reg_sem_3_24_28_adm_form.find({
      isPaid: true,
      paper1: { $in: baSubjects }
    });

    userData.sort((a, b) => {
      const rollA = parseInt(a.collegeRollNumber);
      const rollB = parseInt(b.collegeRollNumber);
      return rollA - rollB;
    });


    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category,
        aadharNumber, mobileNumber, address, district, policeStation, state, pinCode,
        paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign,
        session, paymentSS, dateAndTimeOfPayment,
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
        'College Roll No.': collegeRollNumber,
        'Uni Roll Number': uniRollNumber,
        'Uni Reg Number': uniRegNumber,
        'Course': course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-III & MJC-IV': paper1,
        'MIC-III': paper2,
        'MDC-III': paper3,
        'AEC-III': paper4,
        'SEC-III': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment,
        "Payment SS": paymentSS
      };
    });

    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_III_BA_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem3_24_28BAExcelsheet:", error);
    res.redirect('/ug-reg-sem-3-24-28-list');
  }
};


export const ugRegSem3_24_28BScExcelsheet = async (req, res) => {
  try {
    const bscSubjects = ["Physics", "Chemistry", "Zoology", "Botany", "Mathematics"];

    // Fetch without sorting
    const userData = await Ug_reg_sem_3_24_28_adm_form.find({
      isPaid: true,
      paper1: { $in: bscSubjects }
    });

    // Sort manually by numeric part of collegeRollNo
    userData.sort((a, b) => {
      const rollA = parseInt(a.collegeRollNumber);
      const rollB = parseInt(b.collegeRollNumber);
      return rollA - rollB;
    });

    const users = userData.map(admUser => {
      const {
        studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category,
        aadharNumber, mobileNumber, address, district, policeStation, state, pinCode,
        paper1, paper2, paper3, paper4, paper5, studentPhoto, studentSign,
        session, paymentSS, dateAndTimeOfPayment,
        receiptNo, admissionFee
      } = admUser;

      return {
        'Student Name': studentName,
        'College Roll No.': collegeRollNumber,
        'Uni Roll Number': uniRollNumber,
        'Uni Reg Number': uniRegNumber,
        'Course': "Bachelor of Science",
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-III & MJC-IV': paper1,
        'MIC-III': paper2,
        'MDC-III': paper3,
        'AEC-III': paper4,
        'SEC-III': paper5,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Admission Fee': admissionFee,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment,
        "Payment SS": paymentSS
      };
    });

    // Generate CSV
    const csvParser = new CsvParser();
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=UG_Reg_Sem_III_BSc_Adm_List.csv");

    res.status(200).end(csvData);

  } catch (error) {
    console.error("Error in ugRegSem3_24_28BScExcelsheet:", error);
    res.redirect('/ug-reg-sem-3-24-28-list');
  }
};
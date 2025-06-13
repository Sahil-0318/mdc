import User from "../../models/userModel/userSchema.js"
import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"
import Ug_reg_sem_1_25_29_adm_form from "../../models/Ug_Reg_Sem_1_25_29_Models/adm_Form.js"

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
    

  } catch (error) {
    console.log("Error in ugRegSem1_25_29AllExcelsheet", error)
  }
}


export const ugRegSem1_25_29BAExcelsheet = async (req, res) => {
  try {
    

  } catch (error) {
    console.log("Error in ugRegSem1_25_29BAExcelsheet", error)
  }
}


export const ugRegSem1_25_29BScExcelsheet = async (req, res) => {
  try {
    

  } catch (error) {
    console.log("Error in ugRegSem1_25_29BScExcelsheet", error)
  }
}
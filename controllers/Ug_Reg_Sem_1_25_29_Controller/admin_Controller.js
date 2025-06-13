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
    console.log(foundAdmForm)
    console.log(foundStudent)

    res.render('Ug_Reg_Sem_1_25_29/admStudentDetails', { foundAdmForm, foundStudent, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29StudentDetails", error)
  }
}

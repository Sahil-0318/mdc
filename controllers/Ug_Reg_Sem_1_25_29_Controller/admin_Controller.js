import User from "../../models/userModel/userSchema.js"
import Ug_Reg_Sem_1_25_29_User from "../../models/Ug_Reg_Sem_1_25_29_Models/user.js"

export const ugRegSem1_25_29Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await Ug_Reg_Sem_1_25_29_User.find({})
    res.render("Ug_Reg_Sem_1_25_29/passwordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem1_25_29Password",error)
  }

}


export const ugRegSem1_25_29PasswordPost = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber
    const user = await User.findOne({ _id: req.id })

    if (mobileNumber !== '') {
      let foundMobileNumber = await ugRegularSem4User.find({ mobileNumber })
      res.render("ugRegSem4PasswordList", { list: foundMobileNumber, status: "Found", noOfForms: foundMobileNumber.length, user })

    } else if (mobileNumber === '') {
      const foundMobileNumber = await ugRegularSem4User.find({})
      res.render("ugRegSem4PasswordList", { list: foundMobileNumber, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundMobileNumber.length, user })
    }
  } catch (error) {
    console.log(error)
  }

}
import User from "../../models/userModel/userSchema.js"
import Ug_Reg_Sem_5_23_27_User from "../../models/UG-Regular-Sem-5-23-27/user.js"
import Ug_reg_sem_5_23_27_adm_form from "../../models/UG-Regular-Sem-5-23-27/admForm.js"

export const ugRegSem5_23_27Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await Ug_Reg_Sem_5_23_27_User.find({})
    res.render("Ug_Reg_Sem_5_23_27/passwordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })

  } catch (error) {
    console.log("Error in ugRegSem5_23_27Password", error)
  }
}
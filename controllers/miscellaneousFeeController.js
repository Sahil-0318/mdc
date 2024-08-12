import User from '../models/userModel/userSchema.js'
import MiscellaneousFee from '../models/userModel/miscellaneousFeeSchema.js'

export const marksheet = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const appliedUser = await MiscellaneousFee.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null){
            return res.render('miscellaneousFeeForm', { user, appliedUser })
        }
        return res.render('miscellaneousFeeForm', { user })
    } catch (error) {
        console.log("Error in marksheet get method", error)
    }
}
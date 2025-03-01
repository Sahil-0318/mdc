import jwt from 'jsonwebtoken'
import User from '../models/userModel/userSchema.js'

export const subAdminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.uid
        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifiedUser)
        const user = await User.findOne({ _id: verifiedUser.id })
        if (user.isSubAdmin == true) {
            req.id = user._id
        }
        else {
            res.redirect('login')
        }
        next()

    } catch (error) {
        res.status(401).redirect('login')
    }
}
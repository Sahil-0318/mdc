import User from '../models/userModel/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import unirest from 'unirest'

import ugRegularPart3User from "../models/userModel/UG-Regular-Part-3/user.js"

const login = (req, res) => {
    res.render('login')
}

const loginPost = async (req, res) => {
    try {
        const { userName, password } = req.body
        const result = await User.findOne({ userName })

        if (result != null) {
            const isMatch = await bcrypt.compare(password, result.password)
            if (result.userName == userName && isMatch && result.isSuperAdmin == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('superAdminPage')
            }
            else if (result.userName == userName && isMatch && result.isAdmin == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('adminPage')
            }
            else if (result.userName == userName && isMatch && result.isRecordRoom == true) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('recordRoomPage')
            }
            else if (result.userName == userName && isMatch) {
                // console.log(result);

                const token = jwt.sign({
                    id: result._id,
                    userName : result.userName,
                    email: result.email,
                    isAdmin: result.isAdmin
                }, process.env.SECRET_KEY,
                    { expiresIn: "1d" })
                res.cookie('uid', token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                return res.redirect('userPage')
            } else {
                return res.render('login',{ "invalid": "Invalid Username or Password" })
                // res.send('Invalid email or password')
            }
        } else {
            return res.redirect('register')
        }
    } catch (error) {
        console.log(error);

    }
}

const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
}

const forgotPassword = async (req, res) =>{
    try {
        const portal = req.params.portal
        let registerRoute = ''
        if (portal === "ugRegularPart3") {
            registerRoute = "ugRegularPart3Signup"
        }
        
        res.render("forgotPassword", {portal, registerRoute})
        
    } catch (error) {
        console.log("Error in forgotPassword", error)
    }
}

const forgotPasswordPost = async (req, res) =>{
    try {
        const {mobileNumber, portal} = req.body
        let foundUser = ''
        let userId = ""
        let password = ""
        let registerRoute = ""

        if (portal === "ugRegularPart3") {
           foundUser = await ugRegularPart3User.findOne({mobileNumber})
           registerRoute = "ugRegularPart3Signup"
           if (foundUser !== null){
            userId = foundUser.userId
            password = foundUser.password
           }
        }


        if (foundUser !== null) {
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${userId}|${password}`,
                "route": "dlt",
                "numbers": mobileNumber,
            });

            req.end(function (res) {
                if (res.error) {
                    console.error('Request error:', res.error);
                    return; // Exit the function if there's an error
                }

                if (res.status >= 400) {
                    console.error('Error response:', res.status, res.body);
                    return; // Exit the function if the response status code indicates an error
                }

                console.log('Success:', res.body);
            });

            res.status(201).redirect('ugRegularPart3Login')
           } else {
            res.render("forgotPassword", {portal, registerRoute, invalid : "Please enter registerd mobile number."})
           }
        
    } catch (error) {
        console.log("Error in forgotPasswordPost", error)
    }
}

export {
    login,
    loginPost,
    logout,
    forgotPassword,
    forgotPasswordPost
}
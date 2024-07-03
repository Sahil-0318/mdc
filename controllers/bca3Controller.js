import bca3UserModel from "../models/userModel/BCA-3/user.js"
import bca3FormModel from "../models/userModel/BCA-3/form.js"
import unirest from 'unirest'
import jwt from 'jsonwebtoken'


const bca3Signup = async (req, res) => {
    try {
        res.render("bca3Signup")
    } catch (error) {
        console.log("Error in get method bca3Signup", error)
    }
}


const bca3SignupPost = async (req, res) => {
    try {
        const { fullName, email, mobileNumber } = req.body
        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "During Signup")

        const userMobile = await bca3UserModel.findOne({ mobileNumber, email })
        const userEmail = await bca3UserModel.findOne({ email })



        if (userMobile === null && userEmail === null) {
            // var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            // req.headers({
            //     "authorization": process.env.FAST2SMS_API
            // });

            // req.form({
            //     "sender_id": process.env.DLT_SENDER_ID,
            //     "message": process.env.YOUR_MESSAGE_ID,
            //     "variables_values": genPassword,
            //     "route": "dlt",
            //     "numbers": mobileNumber,
            // });

            // req.end(function (res) {
            //     if (res.error) {
            //         console.error('Request error:', res.error);
            //         return; // Exit the function if there's an error
            //     }

            //     if (res.status >= 400) {
            //         console.error('Error response:', res.status, res.body);
            //         return; // Exit the function if the response status code indicates an error
            //     }

            //     console.log('Success:', res.body);
            // });

            const newUser = await new bca3UserModel({
                fullName, email, mobileNumber, password: genPassword
            })
            const createdUser = await newUser.save()
            res.render("bca3OTP", { OTPComesFrom: "Register", OTPNumber: mobileNumber })
        } else {
            res.render("bca3Signup", { "invalid": 'Mobile No or Email already registered' })
        }
    } catch (error) {
        console.log("Error in post method bca3SignupPost", error)
    }
}

const bca3Login = async (req, res) => {
    try {
        res.render("bca3Login")
    } catch (error) {
        console.log("Error in get method bca3Login", error)
    }
}


const bca3LoginPost = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        const foundUser = await bca3UserModel.findOne({ mobileNumber })
        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "Generated OTP in Login page");

        if (foundUser != null) {

            await bca3UserModel.findOneAndUpdate({ mobileNumber }, { $set: { password: genPassword } })

            // var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            // req.headers({
            //     "authorization": process.env.FAST2SMS_API
            // });

            // req.form({
            //     "sender_id": process.env.DLT_SENDER_ID,
            //     "message": process.env.YOUR_MESSAGE_ID,
            //     "variables_values": genPassword,
            //     "route": "dlt",
            //     "numbers": mobileNumber,
            // });

            // req.end(function (res) {
            //     if (res.error) {
            //         console.error('Request error:', res.error);
            //         return; // Exit the function if there's an error
            //     }

            //     if (res.status >= 400) {
            //         console.error('Error response:', res.status, res.body);
            //         return; // Exit the function if the response status code indicates an error
            //     }

            //     console.log('Success:', res.body);
            // });
            res.render("bca3OTP", { OTPComesFrom: "Login", OTPNumber: mobileNumber })

        } else {
            return res.redirect('bca3Signup')
        }
    } catch (error) {
        console.log("Error in post method bca3LoginPost", error)
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie("uid");
        // res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
        res.status(201).redirect('/bca3Login')
    } catch (error) {
        console.log("Error in get method logout", error)
    }
}


const bca3OTP = async (req, res) => {
    try {
        const { otpInput, OTPNum } = req.body
        const foundUser = await bca3UserModel.findOne({ password: otpInput })
        if (foundUser != null) {

            const token = jwt.sign({
                id: foundUser._id,
                mobileNumber: foundUser.mobileNumber
            }, process.env.SECRET_KEY,
                { expiresIn: "7d" })
            res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

            res.status(201).redirect('/bca3Form')
            // res.json({message : "Sign up success", token : token})

        } else {
            res.render('bca3OTP', { OTPComesFrom: "Login", OTPNumber: OTPNum, "invalid": "Invalid OTP, You can request resend OTP" })
        }
    } catch (error) {
        console.log("Error in post method bca3OTP", error)
    }
}


const bca3ResendOTP = async (req, res) => {
    const { mobNum } = req.params
    try {
        const foundUser = await bca3UserModel.findOne({ mobileNumber: mobNum })

        // Generate OTP Function
        let generateOTP = () => {
            let pass = ""
            for (let index = 0; index < 4; index++) {
                pass = pass + Math.floor(Math.random() * 10)
            }
            return pass
        }
        let genPassword = generateOTP()
        console.log(genPassword, "Resend OTP");

        if (foundUser != null) {

            await bca3UserModel.findOneAndUpdate({ mobileNumber: mobNum }, { $set: { password: genPassword } })

            // var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            // req.headers({
            //     "authorization": process.env.FAST2SMS_API
            // });

            // req.form({
            //     "sender_id": process.env.DLT_SENDER_ID,
            //     "message": process.env.YOUR_MESSAGE_ID,
            //     "variables_values": genPassword,
            //     "route": "dlt",
            //     "numbers": mobNum,
            // });

            // req.end(function (res) {
            //     if (res.error) {
            //         console.error('Request error:', res.error);
            //         return; // Exit the function if there's an error
            //     }

            //     if (res.status >= 400) {
            //         console.error('Error response:', res.status, res.body);
            //         return; // Exit the function if the response status code indicates an error
            //     }

            //     console.log('Success:', res.body);
            // });
            res.render("bca3OTP", { OTPComesFrom: "Login", OTPNumber: mobNum })

        } else {
            return res.render('/bca3OTP', {omesFrom: "Login", OTPNumber: mobNum})
        }
    } catch (error) {
        console.log("Error in get method bca3ResendOTP", error)
    }
}

const bca3Form = async (req, res) => {
    try {
        const user = await bca3UserModel.findOne({ _id: req.id })
        const appliedUser = await bca3FormModel.findOne({ appliedBy: user._id.toString() })
        if (appliedUser != null) {
            res.render('bca3Form', { user, appliedUser })
        } else {
            res.render('bca3Form', { user })
        }
    } catch (error) {
        console.log("Error in get method bca3Form", error)
    }
}


const bca3FormPost = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in post method bca3FormPost", error)
    }
}


export { bca3Form, bca3FormPost, bca3Signup, bca3SignupPost, bca3Login, bca3LoginPost, logout, bca3OTP, bca3ResendOTP }
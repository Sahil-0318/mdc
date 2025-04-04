import interCompartmentUser from '../models/userModel/Inter-Compartmental/user.js'
import interExamForm2 from '../models/userModel/Inter-Compartmental/examForm.js'
import FileUpload from '../fileUpload/fileUpload.js'
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import unirest from 'unirest'
import nodemailer from 'nodemailer'
import PortalOnOff from "../models/adminModel/portalOnOffSchema.js"

export const signup = async (req, res) => {
    try {
        const portal = await PortalOnOff.findOne({ portal: "interCompartment_23-25" })
        if (portal.isOn == true) {
            return res.render("interCompartmentSignup")
        }
        if (portal.isOn == false) {
            return res.render('pageNotFound', { status: "Inter Compartment Exam Form (2023 - 25) has been closed. Thankyou", loginPage: "interCompartmentLogin" })
        }
    } catch (error) {
        console.log("Error in Inter Compartmental Signup Get Method =====>", error)
    }
}

export const signupPost = async (req, res) => {
    try {
        const { fullName, mobileNumber, email } = req.body

        // Generate userId Function
        let generateUserId = () => {
            return (email.slice(0, 6) + mobileNumber.slice(3, 7) + "@MDCN").toUpperCase()
        }
        let createdUserId = generateUserId()

        // Generate Paaword Function
        let genPassword = ""
        function generatePassword() {
            const characters = 'ABC0DEF1GHI2JKL3MNO4PQR5STU6VWX7Y89';
            let password = '';
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            return password;
        }
        genPassword = generatePassword()

        if (await interCompartmentUser.findOne({ password: genPassword }) !== null) {
            genPassword = generatePassword()
        }


        // =======================================================
        console.log(genPassword, "During Signup")

        const checkedUserMobileNumber = await interCompartmentUser.findOne({ mobileNumber })
        // console.log(checkedUserMobileNumber)
        const checkedUserEmail = await interCompartmentUser.findOne({ email })
        // console.log(checkedUserEmail)

        if (checkedUserMobileNumber === null && checkedUserEmail === null) {

            // Sending userId and password on mobile
            var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

            req.headers({
                "authorization": process.env.FAST2SMS_API
            });

            req.form({
                "sender_id": process.env.DLT_USER_PSSWORD_SENDER_ID,
                "message": process.env.YOUR_USER_PSSWORD_MESSAGE_ID,
                "variables_values": `${createdUserId}|${genPassword}`,
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


            // Sending userId and password on email
            const transporter = nodemailer.createTransport({
                service: 'gmail.com',
                // port: 587,
                port: 465,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            });

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Login Credentials',
                // text: 'Yout CLC approved... 🎉',
                text: `Dear Students, Your login credentials are \nUserName is ${createdUserId} and Password is ${genPassword}. \n \n MD College, Patna`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error while sending credentials to email :', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });



            const newUser = new interCompartmentUser({
                fullName,
                email,
                mobileNumber,
                userId: createdUserId,
                password: genPassword
            })

            const registered = await newUser.save();
            res.status(201).redirect('interCompartmentalExamFormLogin')

        } else {
            res.render("interCompartmentalExamFormSignup", { "invalid": 'Mobile No or Email already registered' })
        }
    } catch (error) {
        console.log("Error in Inter Compartmental Signup Post Method =====>", error)
    }
}

export const login = async (req, res) => {
    try {
        res.render("interCompartmentLogin")
    } catch (error) {
        console.log("Error in Inter Compartmental Login Get Method =====>", error)
    }
}

export const loginPost = async (req, res) => {
    try {
        const { userId, password } = req.body
        const foundUser = await interCompartmentUser.findOne({ userId })
        // console.log(foundUser)

        if (foundUser != null) {
            if (foundUser.password === password) {
                const token = jwt.sign({
                    id: foundUser._id,
                    mobileNumber: foundUser.mobileNumber,
                    email: foundUser.email
                }, process.env.SECRET_KEY,
                    { expiresIn: "7d" })
                res.cookie('uid', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })

                res.status(201).redirect('/interCompartmentalExamForm')
            } else {
                return res.render('interCompartmentalExamFormLogin', { invalid: "User Id or Password is incorrect" })
            }
        } else {
            return res.render('interCompartmentalExamFormSignup', { invalid: "User doesn't exists, Please register now." })
        }

    } catch (error) {
        console.log("Error in Inter Compartmental Login Post Method =====>", error)
    }
}

export const logout = async (req, res) => {
    res.clearCookie("uid");
    res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    // res.status(201).redirect('/interCompartmentalExamFormLogin')
}

export const interCompartmentalExamForm = async (req, res) => {
    try {
        const user = await interCompartmentUser.findOne({ _id: req.id })
        // console.log(user)
        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)

        if (appliedUser != null) {
            res.render('interExamForm2', { user, appliedUser })
        } else {
            res.render('interExamForm2', { user })
        }
    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form get Method =====>", error)
    }
}

export const interCompartmentalExamFormPost = async (req, res) => {
    try {
        const user = await interCompartmentUser.findOne({ _id: req.id })
        
        const { registrationNoAndYear, BSEBUniqueId, studentCategory, collegeCode, collegeName, districtName, studentName, fatherName, motherName, dOB, matricPassingBoardName, matricBoardRollCode, matricBoardRollNumber, matricBoardPassingYear, gender, casteCategory, differentlyAbled, nationality, religion, aadharNumber, qualifyingCategoryRollCode, qualifyingCategoryRollNumber, qualifyingCategoryPassingYear, qualifyingCategoryInstitutionArea, qualifyingCategoryInstitutionSubDivision, qualifyingCategoryMobileNumber, qualifyingCategoryEmail, qualifyingCategoryStudentName, qualifyingCategoryFatherName, qualifyingCategoryMotherName, qualifyingCategoryAddress, qualifyingCategoryMaritalStatus, qualifyingCategoryStudentBankAccountNumber, qualifyingCategoryIFSCCode, qualifyingCategoryBankAndBranchName, qualifyingCategoryTwoIdentificationMarks, qualifyingCategoryMediumOfExam, compulsorySubject1, compulsorySubject2, electiveSubject1, electiveSubject2, electiveSubject3, additionalSubject } = req.body

        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })
        let examFee = ""
        if (appliedUser == null){
            const images = req.files

            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].buffer)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);

            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].buffer)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            // -------------
            if(studentCategory === "Regular"){
                // if (casteCategory === "GENERAL" || casteCategory === "BC-2") {
                //     examFee = 1930
                // } else {
                //     examFee = 1670
                // }
                examFee = 2430
            } else if (studentCategory === "Ex Student") {
                examFee = 2090
            } else if (studentCategory === "Compartmental") {
                examFee = 1960
            }

            const newInterExamForm = new interExamForm2({
                registrationNoAndYear : registrationNoAndYear + " and 2025", BSEBUniqueId, studentCategory, collegeCode, collegeName, districtName, studentName, fatherName, motherName, dOB, matricPassingBoardName, matricBoardRollCode, matricBoardRollNumber, matricBoardPassingYear, gender, casteCategory, differentlyAbled, nationality, religion, aadharNumber,
                qualifyingCategoryRollCode, qualifyingCategoryRollNumber, qualifyingCategoryPassingYear, qualifyingCategoryInstitutionArea, qualifyingCategoryInstitutionSubDivision, qualifyingCategoryMobileNumber, qualifyingCategoryEmail, qualifyingCategoryStudentName, qualifyingCategoryFatherName, qualifyingCategoryMotherName, qualifyingCategoryAddress, qualifyingCategoryMaritalStatus, qualifyingCategoryStudentBankAccountNumber, qualifyingCategoryIFSCCode, qualifyingCategoryBankAndBranchName, qualifyingCategoryTwoIdentificationMarks, qualifyingCategoryMediumOfExam,
                compulsorySubject1, compulsorySubject2, electiveSubject1, electiveSubject2, electiveSubject3, additionalSubject,
                faculty : user.faculty,
                studentPhoto: photoURL,
                studentSign: signURL,
                appliedBy: user._id,
                examFee,
                isFormFilled : true
            }) 

            await newInterExamForm.save()
            await interCompartmentUser.findOneAndUpdate({ _id: user._id.toString() }, { $set: { isFormFilled: true } })
            res.redirect("/interExamForm2Pay")
        }
    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form Post", error)
    }
}

export const interExamForm2Pay = async (req, res) => {
    try {
        const user = await interCompartmentUser.findOne({ _id: req.id })
        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser)

        if (appliedUser.isPaid) {
            return res.redirect("/interCompartmentalExamForm")
        }

        qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.examFee)}&tn=${appliedUser.studentName}`, function (err, src) {
            res.status(201).render('interExamForm2PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser })
        })

    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form Pay =====>", error)
    }
}

export const interExamForm2PayPost = async (req, res) => {
    try {
        const { refNo } = req.body
        const user = await interCompartmentUser.findOne({ _id: req.id })
        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })

        const existPaymentId = await interExamForm2.findOne({ paymentId: refNo })

        if (existPaymentId === null) {
            const photoUpload = await FileUpload(req.file.buffer)
            const paymentSSURL = photoUpload.secure_url
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const dateAndTimeOfPayment = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`

            let receiptNo = `MDC-${Date.now()}`

            await interExamForm2.findOneAndUpdate({ appliedBy: user._id.toString() }, { $set: { paymentSS: paymentSSURL, dateAndTimeOfPayment, paymentId: refNo, isPaid: true, receiptNo } })

            res.redirect("/interExamForm2Receipt")

        } else {
            qrcode.toDataURL(`upi://pay?pa=${process.env.UPI_ID}&am=${Number(appliedUser.examFee)}&tn=${appliedUser.studentName}`, function (err, src) {
                res.status(201).render('interExamForm2PayPage', { "qrcodeUrl": src, upiId : process.env.UPI_ID, user, appliedUser, invalid: "Please enter valid UTR / Ref no. (कृपया वैध यूटीआर/रेफ नंबर दर्ज करें।)" })
            })
        }
        

    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form Pay Post =====>", error)
    }
}

export const interExamForm2Receipt = async (req, res) => {
    try {
        const user = await interCompartmentUser.findOne({ _id: req.id })
        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })
        
        if (appliedUser.isPaid === true) {
            res.render("interExamForm2Receipt", { appliedUser, user })
        } else {
            res.redirect("interCompartmentalExamForm")
        }

    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form Receipt =====>", error)
    }
}

export const interExamForm2Copy = async (req, res) => {
    try {
        const user = await interCompartmentUser.findOne({ _id: req.id })
        const appliedUser = await interExamForm2.findOne({ appliedBy: user._id.toString() })
        
        if (appliedUser.isPaid === true) {
            res.render("interExamForm2Copy", { appliedUser, user })
        } else {
            res.redirect("interCompartmentalExamForm")
        }

    } catch (error) {
        console.log("Error in Inter Compartmental Exam Form Copy =====>", error)
    }
}
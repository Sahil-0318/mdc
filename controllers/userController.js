import User from '../models/userModel/userSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import FileUpload from '../fileUpload/fileUpload.js'

// Index Page
const index = async (req, res) => {
    return res.render('index')
}


// User Index Page
const userPage = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        return res.render('userPage', { user })
    } catch (error) {
        res.status(401)
    }
}


// Admission Form
const admissionForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        // console.log(user);
        
        const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log('line 32');
        // console.log(appliedUser);


        if (appliedUser!==null) {
            
            if (!appliedUser.isPaid) {
                // console.log('38');
                // if (appliedUser.gender === 'Female') {
                //     res.status(201).render('paymentPage', { "amount": "100", user })
                    
                // } else {
                //     if (appliedUser.category === "General") {
                //         res.status(201).render('paymentPage', { "amount": "150", user })
                        
                //     } else if(appliedUser.category === "SC" || caste === "ST") {
                //         res.status(201).render('paymentPage', { "amount": "100", user })
                        
                //     } else if(category === "OBC"){
                //         res.status(201).render('paymentPage', { "amount": "120", user })
    
                //     }
                // }
                if (appliedUser.category === "General" || appliedUser.category === "BC-2") {
                    res.status(201).render('paymentPage', { "amount": "3000", user })
                            
                } else if(appliedUser.category === "BC-1" || appliedUser.category === "SC" || appliedUser.category === "ST") {
                    res.status(201).render('paymentPage', { "amount": "2830", user })     
                }
            }
            else{
                return res.render('admissionForm', { user, appliedUser })
            }
        }
        else{
            return res.render('admissionForm', { user })
        }

        


    } catch (error) {
        res.status(401)
    }
}


// Admission Form Post
const admissionFormPost = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.id })
        console.log('line 85');
        // console.log(user);

        const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);
        console.log("line 90");

        const { fullName, rollNumber, session, aadharNumber, dOB, gender, nationality, category, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email, course } = req.body

        
        
        const collCount = await AdmissionForm.countDocuments()
        // console.log(collCount);
        const admCount = collCount+1
        // console.log(admCount);
        
        let slipNo = ""
        if (course === "I.A") {
            slipNo = "I.A/" + "2023-2025/" + (collCount+1)
        } else {
            slipNo = "I.Sc/" + "2023-2025/" + (collCount+1)
        }


        if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
            // console.log(req.files);
            const images = req.files
            
            // console.log(images[0].path);
            const photoUpload = await FileUpload(images[0].path)
            const photoURL = photoUpload.secure_url
            // console.log(photoURL);
            
            // console.log(images[1].path);
            const signUpload = await FileUpload(images[1].path)
            const signURL = signUpload.secure_url
            // console.log(signURL);

            let admFee = ""
            if (category === "General" || category === "BC-2") {
                admFee = 3000       
            } else if(category === "BC-1" || category === "SC" || appliedUser.category === "ST") {
                admFee = 2830        
            }



            const admForm = new AdmissionForm({
                fullName,
                rollNumber,
                session,
                aadharNumber,
                dOB,
                gender,
                nationality,
                religion,
                category,
                fatherName,
                motherName,
                parmanentAddress,
                parmanentAddressPin,
                presentAddress,
                presentAddressPin,
                mobileNumber,
                email,
                course,
                admissionPhoto: photoURL,
                studentSign: signURL,
                admNumber: admCount,
                slipNo: slipNo,
                appliedBy: user._id,
                admFee
            })

            const admFormSubmitted = await admForm.save();
            console.log('line 131');
            // console.log(admFormSubmitted);

            // if (gender === 'Female') {
            //     res.status(201).render('paymentPage', { "amount": "100", user })
                
            // } else {
            //     if (category === "General") {
            //         res.status(201).render('paymentPage', { "amount": "150", user })
                    
            //     } else if(category === "SC" || caste === "ST") {
            //         res.status(201).render('paymentPage', { "amount": "100", user })
                    
            //     } else if(category === "OBC") {
            //         res.status(201).render('paymentPage', { "amount": "120", user })

            //     }
            // }

            if (category === "General" || category === "BC-2") {
                res.status(201).render('paymentPage', { "amount": "3000", user })
                console.log('Here is problem');
                
                        
            } else if(category === "BC-1" || category === "SC" || appliedUser.category === "ST") {
                res.status(201).render('paymentPage', { "amount": "2830", user })     
            }

            // res.status(201).render('admissionForm', { "submitted": "Form Submitted", user, admFormSubmitted })
            
            // res.status(201).render('admissionForm', { "submitted": "Form Submitted", user, admFormSubmitted })
            // const url = 'http://localhost:5000/payment'
            // res.status(201).redirect(url)
        }
        else {
            res.status(201).render('admissionForm', { "alreadysubmitted": "You have already submitted the form.", user })
        }
    } catch (error) {
        res.status(401)
    }
}


// CLC Form
const clc = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })

        return res.render('clc', { user })
    } catch (error) {
        res.status(401)
    }
}


// CLC Form Post
const clcPost = async (req, res) => {
    try {
        const { fName, lName, collegeClass, classRoll, session, dOB, uniRollNumber, registrationNumber, yOPUniEx, subTaken, fatherName, email } = req.body
        const user = await User.findOne({ _id: req.id })

        const appliedUser = await clcSchema.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);

        if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
            const clcForm = new clcSchema({
                fName,
                lName,
                collegeClass,
                classRoll,
                session,
                dOB,
                uniRollNumber,
                registrationNumber,
                yOPUniEx,
                subTaken,
                fatherName,
                email,
                appliedBy: user._id
            })
            const sendApproval = await clcForm.save();
            res.status(201).render('clc', { "submitted": "Form Submitted", user })
        }
        else {
            res.status(201).render('clc', { "alreadysubmitted": "You have already submitted the form.", user })
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).render('error');
    }

}


export {
    index,
    userPage,
    admissionForm,
    admissionFormPost,
    clc,
    clcPost
}
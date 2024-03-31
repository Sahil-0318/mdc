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
        
        
        return res.render('admissionForm', { user })
    } catch (error) {
        res.status(401)
    }
}


// Admission Form Post
const admissionFormPost = async (req, res) => {
    try {
        const fileUpload = await FileUpload(req.file.path)
        const photoURL = fileUpload.secure_url
        
        const user = await User.findOne({ _id: req.id })
        // console.log(user);
        
        const appliedUser = await AdmissionForm.findOne({ appliedBy: user._id.toString() })
        // console.log(appliedUser);

        const {fullName, registrationNumber, currentYear, aadharNumber, dOB, gender, nationality, caste, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email} = req.body


        if (appliedUser == null || appliedUser.appliedBy != user._id.toString()) {
            const admForm = new AdmissionForm({
              fullName,
              registrationNumber,
              currentYear,
              aadharNumber,
              dOB,
              gender,
              nationality,
              religion,
              caste,
              fatherName,
              motherName,
              parmanentAddress,
              parmanentAddressPin,
              presentAddress,
              presentAddressPin,
              mobileNumber,
              email,
              admissionPhoto: photoURL,
              appliedBy: user._id
            })
      
            const admFormSubmitted = await admForm.save();
            res.status(201).render('admissionForm', { "submitted": "Form Submitted", user })
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
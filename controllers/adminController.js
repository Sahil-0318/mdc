import User from '../models/userModel/userSchema.js'
import Clc from '../models/userModel/clcSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import path from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import nodemailer from 'nodemailer'

const adminPage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const maleStudents = await AdmissionForm.find({gender: 'Male', isPaid: "true"})
    const femaleStudents = await AdmissionForm.find({gender: 'Female', isPaid: "true"})
    let NoOfMaleStudents = maleStudents.length
    let NoOfFemaleStudents = femaleStudents.length
    let totalStudents = NoOfMaleStudents + NoOfFemaleStudents
    let studentsNumber = {
      NoOfMaleStudents,
      NoOfFemaleStudents,
      totalStudents
    }

    return res.render('adminPage', { studentsNumber, user })
  } catch (error) {
    res.status(401)
  }
}


const admissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({})
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "All", noOfForms: AdmissionList.length , user })
  } catch (error) {
    res.status(401)
  }
}


const paidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({isPaid: "true"})
    // console.log(AdmissionList.length);
    res.render('admissionFormList', { list: AdmissionList, status: "Paid", noOfForms: AdmissionList.length , user })
  } catch (error) {
    res.status(401)
  }
}


const unpaidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({isPaid: "false"})
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "Unpaid", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}


const genBC2Category = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({isPaid: "true",admFee: "3000"})
    // console.log(AdmissionList);
    res.render('admissionFormList', { list: AdmissionList, status: "General/BC-2", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}


const bc1SCSTCategory = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({isPaid: "true",admFee: "2830"})
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "BC-1/SC/ST", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}



const findStuInAdmForm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let {findStuName, findStuRefNo} = req.body
    if (findStuName!=='' && findStuRefNo==="") {
      // console.log(findStuName.toUpperCase());
      // console.log('Without Ref No');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase() })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length , user })
      
    }else if (findStuName==='' && findStuRefNo!==""){
      // console.log(findStuName);
      // console.log('Without Name');
      let AdmissionList = await AdmissionForm.find({ refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length , user })

    }else if (findStuName!=='' && findStuRefNo!==""){
      // console.log(findStuName);
      // console.log('With Both');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase(),refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length , user })

    }else{
      const AdmissionList = await AdmissionForm.find({})
      res.render('admissionFormList', { list: AdmissionList,formAlert: "Please, Enter Student Name or Ref No", user })
      // res.render('admissionFormList', { formAlert: "Please, Enter Student Name or Ref No", user })
    }
    
  } catch (error) {
    res.status(401)
  }
}

const clcList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const clcApprovalList = await Clc.find({ isApprove: "false" })
    // console.log(allUser);
    res.render('clcList', { pending: clcApprovalList, user })
  } catch (error) {
    res.status(401)
  }
}


const approvedByAdmin = async (req, res) => {
  try {
    
    let reg = req.body.registrationNumber

    const checked = await Clc.findOneAndUpdate({ registrationNumber: reg }, { isApprove: true })
    // console.log(checked);
    const email = checked.email
    const trimmedFname = checked.fName;

    //Create pdf

    const document = await PDFDocument.load(readFileSync("./certificateForm.pdf"));

    const courierBoldFont = await document.embedFont(StandardFonts.Courier);
    const firstPage = document.getPage(0);

    // firstPage.moveTo(72, 570);
    // firstPage.drawText(new Date().toUTCString(), {
    //   font: courierBoldFont,
    //   size: 12,
    // });

    firstPage.moveTo(110, 600);
    firstPage.drawText(`${trimmedFname}${checked.lName}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(110, 585);
    firstPage.drawText(`${checked.collegeClass}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(160, 537);
    firstPage.drawText(`${checked.dOB}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(160, 505);
    firstPage.drawText(`${checked.fatherName}`, {
      font: courierBoldFont,
      size: 10,
    });

    firstPage.moveTo(163, 488);
    firstPage.drawText(`${checked.subTaken}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(420, 600);
    firstPage.drawText(`${checked.classRoll}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(380, 585);
    firstPage.drawText(`${checked.session}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(433, 553);
    firstPage.drawText(`${checked.uniRollNumber}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(421, 537);
    firstPage.drawText(`${checked.registrationNumber}`, {
      font: courierBoldFont,
      size: 16,
    });

    firstPage.moveTo(428, 505);
    firstPage.drawText(`${checked.yOPUniEx}`, {
      font: courierBoldFont,
      size: 16,
    });

    // writeFileSync(checked.registrationNumber + ".pdf", await document.save());
    writeFileSync("RegNo_" + checked.registrationNumber + "_CLC.pdf", await document.save());


    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
      subject: 'Certificates',
      text: 'Yout CLC approved... 🎉',
      attachments: [{
        filename: "RegNo_" + checked.registrationNumber + "_CLC.pdf",
        path: path.join("RegNo_" + checked.registrationNumber + "_CLC.pdf")
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });


    // console.log(reg);
    res.status(201).redirect('/clcList');

  } catch (err) {
    res.status(400).send(err);

  }
}



// const admissionList = async (req, res) => {
//   try {
//     const user = await Student.findOne({ _id: req.id })
//     const AdmissionList = await AdmissionForm.find({})
//     // console.log(allUser);
//     res.render('admissionList', { list: AdmissionList, user })
//   } catch (error) {
//     res.status(401)
//   }
// }


export {
  adminPage,
  admissionFormList,
  paidAdmissionFormList,
  unpaidAdmissionFormList,
  genBC2Category,
  bc1SCSTCategory,
  clcList,
  approvedByAdmin,
  findStuInAdmForm
}
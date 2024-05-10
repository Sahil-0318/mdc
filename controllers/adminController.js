import User from '../models/userModel/userSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import Notice from '../models/adminModel/noticeSchema.js'
import path from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync } from "fs"
import nodemailer from 'nodemailer'
import Csv from 'json2csv'
const CsvParser = Csv.Parser

const adminPage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const maleStudents = await AdmissionForm.find({ gender: 'Male', isPaid: "true" })
    const femaleStudents = await AdmissionForm.find({ gender: 'Female', isPaid: "true" })
    let NoOfMaleStudents = maleStudents.length
    let NoOfFemaleStudents = femaleStudents.length
    let totalStudents = NoOfMaleStudents + NoOfFemaleStudents
    let studentsNumber = {
      NoOfMaleStudents,
      NoOfFemaleStudents,
      totalStudents
    }

    const noOfStudents = {
      labels: ['Male', 'Female'],
      datasets: [{
        backgroundColor: [
          "rgba(0, 156, 255, .7)",
          "rgba(0, 15, 255, .6)"
        ],
        data: [NoOfMaleStudents, NoOfFemaleStudents]
      }]
    };

    const genStu = await AdmissionForm.find({ isPaid: "true", category: "General" })
    let noOfGenStu = genStu.length
    const bc2Stu = await AdmissionForm.find({ isPaid: "true", category: "BC-2" })
    let noOfBc2Stu = bc2Stu.length
    const bc1Stu = await AdmissionForm.find({ isPaid: "true", category: "BC-1" })
    let noOfBc1Stu = bc1Stu.length
    const scStu = await AdmissionForm.find({ isPaid: "true", category: "SC" })
    let noOfScStu = scStu.length
    const stStu = await AdmissionForm.find({ isPaid: "true", category: "ST" })
    let noOfstStu = stStu.length

    const category = {
      labels: ["General", "BC-2", "BC-1", "SC", "ST"],
      datasets: [{
        backgroundColor: [
          "rgba(0, 156, 255, .7)",
          "rgba(0, 156, 255, .6)",
          "rgba(0, 156, 255, .5)",
          "rgba(0, 156, 255, .4)",
          "rgba(0, 156, 255, .3)"
        ],
        data: [noOfGenStu, noOfBc2Stu, noOfBc1Stu, noOfScStu, noOfstStu]
      }]
    }


    return res.render('adminPage', { studentsNumber, user, noOfStudents, category })
  } catch (error) {
    res.status(401)
  }
}

const admissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({})
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "All", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const paidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true" })
    // console.log(AdmissionList.length);
    res.render('admissionFormList', { list: AdmissionList, status: "Paid", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const unpaidAdmissionFormList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "false" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "Unpaid", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const genBC2Category = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", admFee: "3000" })
    // console.log(AdmissionList);
    res.render('admissionFormList', { list: AdmissionList, status: "General/BC-2", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const bc1SCSTCategory = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", admFee: "2830" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "BC-1/SC/ST", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const scienceStu = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", course: "I.Sc" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "I.Sc Students", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const artsStu = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const AdmissionList = await AdmissionForm.find({ isPaid: "true", course: "I.A" })
    // console.log(allUser);
    res.render('admissionFormList', { list: AdmissionList, status: "I.A Students", noOfForms: AdmissionList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const findStuInAdmForm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuName, findStuRefNo } = req.body
    if (findStuName !== '' && findStuRefNo === "") {
      // console.log(findStuName.toUpperCase());
      // console.log('Without Ref No');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase() })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else if (findStuName === '' && findStuRefNo !== "") {
      // console.log(findStuName);
      // console.log('Without Name');
      let AdmissionList = await AdmissionForm.find({ refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else if (findStuName !== '' && findStuRefNo !== "") {
      // console.log(findStuName);
      // console.log('With Both');
      let AdmissionList = await AdmissionForm.find({ fullName: findStuName.toUpperCase(), refNo: findStuRefNo })
      res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

    } else {
      const AdmissionList = await AdmissionForm.find({})
      res.render('admissionFormList', { list: AdmissionList, formAlert: "Please, Enter Student Name or Ref No", user })
      // res.render('admissionFormList', { formAlert: "Please, Enter Student Name or Ref No", user })
    }

  } catch (error) {
    res.status(401)
  }
}

const datewiseAdmForm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findAdmDateFrom, findAdmDateTo } = req.body

    let AdmissionList = await AdmissionForm.find({ "createdAt": { $lt: new Date(findAdmDateTo), $gt: new Date(findAdmDateFrom) }, isPaid: "true" })

    res.render('admissionFormList', { list: AdmissionList, status: "Found", noOfForms: AdmissionList.length, user })

  } catch (error) {
    res.status(401)
  }
}

const downloadExcel = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let users = []
    const userData = await AdmissionForm.find({ isPaid: true })
    userData.forEach((admUser) => {
      const { fullName, rollNumber, session, aadharNumber, dOB, gender, nationality, category, religion, fatherName, motherName, parmanentAddress, parmanentAddressPin, presentAddress, presentAddressPin, mobileNumber, email, course, admissionPhoto, studentSign, admNumber, slipNo, admFee, refNo, paymentSS } = admUser

      users.push({
        'Full Name': fullName,
        'Roll No.': rollNumber,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Nationality': nationality,
        'Category': category,
        'Religion': religion,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Parmanent Address': parmanentAddress,
        'Parmanent Address Pin': parmanentAddressPin,
        'Present Address': presentAddress,
        'Present Address Pin': presentAddressPin,
        'Mobile No.': mobileNumber,
        'Email': email,
        'Course': course,
        "Student's Photo": admissionPhoto,
        "Student's Sign": studentSign,
        "Admission Number": admNumber,
        "Slip No.": slipNo,
        "Admission Fee": admFee,
        "Reference No.": refNo,
        "Payment SS": paymentSS

      })
    })

    // const csvFields = ['Full Name', 'Roll No.', 'Session', 'Aadhar No.']
    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=InterAdmissionList.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const notice = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })

    let notices = await Notice.find()
    res.render('notice', { notices, user })


  } catch (error) {
    res.status(401)
  }
}

const noticePost = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })

    const { noticeTitle, noticeDetail } = req.body

    const notice = new Notice({
      noticeTitle,
      noticeDetail
    })

    let newNotice = await notice.save()

    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const editNotice = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params
    const editNotice = await Notice.findOne({ _id: id })

    res.render('editNotice', { editNotice, user })


  } catch (error) {
    res.status(401)
  }
}

const editNoticePost = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params
    const { noticeTitle, noticeDetail } = req.body

    const editedNotice = await Notice.findOneAndUpdate({ _id: id }, { $set: { noticeTitle, noticeDetail } })

    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const deleteNotice = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params
    const deletedNotice = await Notice.findOneAndDelete({ _id: id })

    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const clcList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({status: 'Pending'})
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Pending", noOfForms: clcList.length,  user })
  } catch (error) {
    res.status(401)
  }
}

const clcApprovedId = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findOne({ _id: req.id })
    const foundClc = await clcSchema.findOneAndUpdate({ _id: id }, { $set: { status: "Approved" } })
    // console.log(foundClc);
    res.redirect('/clcList')
  } catch (error) {
    res.status(401)
  }
}

const clcRejectId = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findOne({ _id: req.id })
    const foundClc = await clcSchema.findOneAndUpdate({ _id: id }, { $set: { status: "Rejected" } })
    // console.log(foundClc);
    res.redirect('/clcList')
  } catch (error) {
    res.status(401)
  }
}

const clcApproved = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: "Approved" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Approved", noOfForms: clcList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const clcRejected = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: "Rejected" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Rejected", noOfForms: clcList.length, user })
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

export {
  adminPage,
  admissionFormList,
  paidAdmissionFormList,
  unpaidAdmissionFormList,
  genBC2Category,
  bc1SCSTCategory,
  scienceStu,
  artsStu,
  clcList,
  clcApprovedId,
  clcRejectId,
  clcApproved,
  clcRejected,
  approvedByAdmin,
  findStuInAdmForm,
  datewiseAdmForm,
  downloadExcel,
  notice,
  noticePost,
  editNotice,
  editNoticePost,
  deleteNotice
}
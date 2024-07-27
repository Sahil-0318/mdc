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
import FileUpload from '../fileUpload/fileUpload.js'
import FileDelete from '../fileUpload/fileDelete.js'

import ugRegularSem1AdmissionForm from "../models/userModel/ugRegularSem1AdmissionFormSchema.js"
import ugRegularSem1AdmissionPortal from "../models/userModel/ugRegularSem1AdmissionPortalSchema.js"

import ugRegularSem3User from "../models/userModel/UG-Regular-Sem-3/user.js"
import ugRegularSem3AdmissionForm from "../models/userModel/UG-Regular-Sem-3/admForm.js"

// BCA 3 List
import bca3FormModel from "../models/userModel/BCA-3/form.js"
import bca3UserModel from "../models/userModel/BCA-3/user.js"



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
    const { noticeTitle } = req.body
    const photoUpload = await FileUpload(req.file.path)
    const noticePDF = photoUpload.secure_url
    const notice = new Notice({
      noticeTitle,
      noticePDF
    })

    await notice.save()

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
    const { id } = req.params
    const foundNotice = await Notice.findOne({ _id: id })
    const { noticeTitle } = req.body
    const photoUpload = await FileUpload(req.file.path)
    const noticePDF = photoUpload.secure_url
    
    await Notice.findOneAndUpdate({ _id: id }, { $set: { noticeTitle, noticePDF } })
    await FileDelete(foundNotice.noticePDF)
    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params
    const deletedNotice = await Notice.findOneAndDelete({ _id: id })
    await FileDelete(deletedNotice.noticePDF)
    res.redirect('/notice')


  } catch (error) {
    res.status(401)
  }
}

const clcList = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const clcList = await clcSchema.find({ status: 'Pending', isPaid: "true" })
    // console.log(clcList);
    res.render('clcList', { clcList, status: "Pending", noOfForms: clcList.length, user })
  } catch (error) {
    res.status(401)
  }
}

const clcApprovedId = async (req, res) => {
  try {
    const { id } = req.params
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
    const { id } = req.params
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
    const { id } = req.params
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
    const { id } = req.params
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



// UG Regular Sem 1 List
const ugRegularSem1List = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const ugRegularSem1AdmissionList = await ugRegularSem1AdmissionForm.find({ isPaid: true })
    // console.log(ugRegularSem1AdmissionList);
    res.render('ugRegularSem1List', { list: ugRegularSem1AdmissionList, status: "All", noOfForms: ugRegularSem1AdmissionList.length, user })
  } catch (error) {
    console.log(error);
  }
}

const findStuInUGRegSem1Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuRefNo } = req.body

    if (findStuRefNo !== '') {
      let foundStudent = await ugRegularSem1AdmissionForm.find({ referenceNumber: findStuRefNo })
      res.render('ugRegularSem1List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuRefNo === '') {
      const foundStudent = await ugRegularSem1AdmissionForm.find({ isPaid: true })
      res.render('ugRegularSem1List', { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}


const ugRegSem1StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularSem1AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })

    res.render('studentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}

const verifyUgRegSem1Stu = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { Id } = req.params
    const foundStudent = await ugRegularSem1AdmissionForm.findOneAndUpdate({ _id: Id }, { $set: { isVerified: true } })
    const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })
    res.redirect("/ugRegularSem1List")

  } catch (error) {
    console.log(error);
  }
}

const datewiseUgRegSem1List = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { course, findAdmDateFrom, findAdmDateTo } = req.body
    console.log(course)

    const changedate = (date) => {
      let originalDate = date;
      // Split the date string
      let parts = originalDate.split("-");
      // Rearrange and join the parts
      let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return formattedDate
    }

    let results = ""
    let status = ""

    // subject query function
    let subjectQuery = (subject) => {
      let query = {
        dateAndTimeOfPayment: {
          $gte: changedate(findAdmDateFrom) + " 00:00:00",
          $lte: changedate(findAdmDateTo) + " 23:59:59"
        },
        isPaid: true,
        paper1: subject
      };
      return query
    }


    // drop down list query
    if (course === "All courses") {
      let query = {
        dateAndTimeOfPayment: {
          $gte: changedate(findAdmDateFrom) + " 00:00:00",
          $lte: changedate(findAdmDateTo) + " 23:59:59"
        },
        isPaid: true
      };

      results = await ugRegularSem1AdmissionForm.find(query)
      status = "All"
    } else if (course === "Bachelor of Arts") {

      let EconomicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Economics"))
      let HistoryResult = await ugRegularSem1AdmissionForm.find(subjectQuery("History"))
      let PoliticalScienceResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Political Science"))
      let PsychologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Psychology"))
      let SociologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Sociology"))
      let EnglishResult = await ugRegularSem1AdmissionForm.find(subjectQuery("English"))
      let HindiResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Hindi"))
      let UrduResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Urdu"))
      let PhilosophyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Philosophy"))

      results = [...EconomicsResult, ...HistoryResult, ...PoliticalScienceResult, ...PsychologyResult, ...SociologyResult, ...EnglishResult, ...HindiResult, ...UrduResult, ...PhilosophyResult]
      status = "Bachelor of Arts"

    } else if (course === "Bachelor of Science") {

      let PhysicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Physics"))
      let ChemistryResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Chemistry"))
      let ZoologyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Zoology"))
      let BotanyResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Botany"))
      let MathematicsResult = await ugRegularSem1AdmissionForm.find(subjectQuery("Mathematics"))

      results = [...PhysicsResult, ...ChemistryResult, ...ZoologyResult, ...BotanyResult, ...MathematicsResult]
      status = "Bachelor of Science"
    } else if (course === "Economics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Economics"))
      status = "Economics"
    } else if (course === "History") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("History"))
      status = "History"

    } else if (course === "Political Science") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Political Science"))
      status = "Political Science"

    } else if (course === "Psychology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Psychology"))
      status = "Psychology"

    } else if (course === "Sociology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Sociology"))
      status = "Sociology"

    } else if (course === "English") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("English"))
      status = "English"

    } else if (course === "Hindi") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Hindi"))
      status = "Hindi"

    } else if (course === "Urdu") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Urdu"))
      status = "Urdu"

    } else if (course === "Philosophy") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Philosophy"))
      status = "Philosophy"

    } else if (course === "Physics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Physics"))
      status = "Physics"

    } else if (course === "Chemistry") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Chemistry"))
      status = "Chemistry"

    } else if (course === "Zoology") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Zoology"))
      status = "Zoology"

    } else if (course === "Botany") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Botany"))
      status = "Botany"

    } else if (course === "Mathematics") {
      results = await ugRegularSem1AdmissionForm.find(subjectQuery("Mathematics"))
      status = "Mathematics"
    }
    console.log(results.length);

    res.render('ugRegularSem1List', { course, findAdmDateFrom, findAdmDateTo, list: results, status, noOfForms: results.length, user })

  } catch (error) {
    console.log(error)
  }
}

const UG_Reg_Sem_I_BA_SS_Adm_List = async (req, res) => {
  try {
    let users = []
    const economicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Economics" })
    const historyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "History" })
    const politicalScienceStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Political Science" })
    const psychologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Psychology" })
    const sociologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Sociology" })

    console.log(economicsStudents.length, historyStudents.length, politicalScienceStudents.length, psychologyStudents.length, sociologyStudents.length)

    const userData = [...economicsStudents, ...historyStudents, ...politicalScienceStudents, ...psychologyStudents, ...sociologyStudents]
    
    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"
        
      }else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"
        
      } else {
        course = "Bachelor of Science"
        
      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course' : course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1' : paper1,
        'MIC-1' : paper2,
        'MDC-1' : paper3,
        'AEC-1' : paper4,
        'SEC-1' : paper5,
        'VAC-1' : paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BA_SS_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BA_Hum_Adm_List = async (req, res) => {
  try {
    let users = []
    const englishStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "English" })
    const hindiStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Hindi" })
    const urduStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Urdu" })
    const philosophyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Philosophy" })

    console.log(englishStudents.length, hindiStudents.length, urduStudents.length, philosophyStudents.length)

    const userData = [...englishStudents, ...hindiStudents, ...urduStudents, ...philosophyStudents]
    
    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"
        
      }else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"
        
      } else {
        course = "Bachelor of Science"
        
      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course' : course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1' : paper1,
        'MIC-1' : paper2,
        'MDC-1' : paper3,
        'AEC-1' : paper4,
        'SEC-1' : paper5,
        'VAC-1' : paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BA_Hum_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const UG_Reg_Sem_I_BSc_Adm_List = async (req, res) => {
  try {
    let users = []
    const physicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Physics" })
    const chemistryStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Chemistry" })
    const zoologyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Zoology" })
    const botanyStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Botany" })
    const mathematicsStudents = await ugRegularSem1AdmissionForm.find({ isPaid: true, paper1 : "Mathematics" })
    console.log(physicsStudents.length, chemistryStudents.length, zoologyStudents.length, botanyStudents.length, mathematicsStudents.length)

    const userData = [...physicsStudents, ...chemistryStudents, ...zoologyStudents, ...botanyStudents, ...mathematicsStudents]
    
    userData.forEach((admUser) => {
      const { studentName, fatherName, motherName, referenceNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, ppuConfidentialNumber, studentPhoto, studentSign, session, collegeRollNo, paymentSS, dateAndTimeOfPayment, receiptNo } = admUser

      let course = ""

      if (paper1 === "Economics" || paper1 === "History" || paper1 === "Political Science" || paper1 === "Psychology" || paper1 === "Sociology") {
        course = "Bachelor of Arts (Social Science Subjects)"
        
      }else if (paper1 === "English" || paper1 === "Hindi" || paper1 === "Urdu" || paper1 === "Philosophy") {
        course = "Bachelor of Arts (Humanities Subjects)"
        
      } else {
        course = "Bachelor of Science"
        
      }

      users.push({
        'Student Name': studentName,
        'College Roll No.': collegeRollNo.slice(2),
        'Reference Number': referenceNumber,
        'PPU Confidential Number': ppuConfidentialNumber,
        'Course' : course,
        'Session': session,
        'Aadhar No.': aadharNumber,
        'DOB': dOB,
        'Gender': gender,
        'Category': category,
        'MJC-1' : paper1,
        'MIC-1' : paper2,
        'MDC-1' : paper3,
        'AEC-1' : paper4,
        'SEC-1' : paper5,
        'VAC-1' : paper6,
        "Father's Name": fatherName,
        "Mother's Name": motherName,
        'Address': `Add - ${address}, District - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
        'Mobile No.': mobileNumber,
        'Email': email,
        "Student's Photo": studentPhoto,
        "Student's Sign": studentSign,
        "Payment Receipt No.": receiptNo,
        "Admission Date": dateAndTimeOfPayment.slice(0, 10),
        "Payment SS": paymentSS

      })
    })

    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", "attachment: filename=UG_Reg_Sem_I_BSc_Adm_List.csv")

    res.status(200).end(csvData)


  } catch (error) {
    res.status(401)
  }
}

const ugRegSem1Password = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const userIdAndPasswordList = await ugRegularSem1AdmissionPortal.find({})
    res.render("ugRegSem1PasswordList", { list: userIdAndPasswordList, status: "All", noOfForms: userIdAndPasswordList.length, user })
  } catch (error) {
    console.log(error)
  }

}

const editUserId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { id } = req.params

    const foundStudent = await ugRegularSem1AdmissionPortal.findOne({ _id: id })
    const selectedValue = foundStudent.course
    console.log(selectedValue)
    // const foundStudentID = await ugRegularSem1AdmissionPortal.findOne({ _id: foundStudent.appliedBy })
    res.render("editUserIdForm", { selectedValue, foundStudent, user })

  } catch (error) {
    console.log(error)
  }
}

const editUserIdPost = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { editId } = req.params
    const { course, referenceNumber, mobileNumber, userId, password } = req.body
    // console.log(editId, course, mobNo)

    await ugRegularSem1AdmissionPortal.findOneAndUpdate({ _id: editId }, { $set: { course, referenceNumber, mobileNumber, userId, password } })

    res.redirect('/ugRegSem1Password')

  } catch (error) {
    console.log(error)
  }
}

const findUserId = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { findStuRefNo } = req.body

    if (findStuRefNo !== '') {
      let foundStudent = await ugRegularSem1AdmissionPortal.find({ referenceNumber: findStuRefNo })
      res.render("ugRegSem1PasswordList", { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuRefNo === '') {
      const foundStudent = await ugRegularSem1AdmissionPortal.find({})
      res.render("ugRegSem1PasswordList", { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error)
  }
}


// UG Regular Sem 3 List

const ugRegularSem3List = async (req, res) => {
  try {
    let queries = req.query
    
    let status = ""
    if (queries.isPaid === 'true') {
      status = "Paid"
    } else if(queries.isPaid === 'false'){
      status = "Unpaid"
    } else{
      status = "All"
    }

    const user = await User.findOne({ _id: req.id })
    const ugRegularSem1AdmissionList = await ugRegularSem3AdmissionForm.find(queries)
    // console.log(ugRegularSem1AdmissionList);
    res.render('ugRegularSem3List', { list: ugRegularSem1AdmissionList, status, noOfForms: ugRegularSem1AdmissionList.length, user })
  } catch (error) {
    console.log(error);
  }
}


const findStuInUGRegSem3Adm = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body

    if (findStuMobileNo !== '') {
      let foundStudent = await ugRegularSem3AdmissionForm.find({ mobileNumber: findStuMobileNo })
      res.render('ugRegularSem3List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await ugRegularSem3AdmissionForm.find({ isPaid: true })
      res.render('ugRegularSem3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error);
  }
}


const ugRegSem3StuView = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await ugRegularSem3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem3User.findOne({ _id: foundStudent.appliedBy })

    res.render('ugRegularSem3StudentView', { foundStudent, foundStudentID, user })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem3StuEdit = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await ugRegularSem3AdmissionForm.findOne({ _id: stuId })
    const foundStudentID = await ugRegularSem3User.findOne({ _id: foundStudent.appliedBy })
    res.render("ugRegularSem3StudentEdit", { user, foundStudent, foundStudentID })
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem3StuEditPost = async (req, res) => {
  try {
    let { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    if (gender === "MALE") {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
          if (category === "GENERAL" || category === "BC-2") {
              admissionFee = 2755
          } else if (category === "BC-1") {
              admissionFee = 2155
          } else {
              admissionFee = 1350
          }
      } else {
          if (category === "GENERAL" || category === "BC-2") {
              admissionFee = 2155
          } else if (category === "BC-1") {
              admissionFee = 1555
          } else {
              admissionFee = 750
          }
      }

  } else {
      if (course === "Bachelor of Science" || paper1 === "Psychology") {
          admissionFee = 1350
      } else {
          admissionFee = 750
      }
  }

    await ugRegularSem3AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularSem3AdmissionForm.findOne({ _id: editId })
    await ugRegularSem3User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, course, email, mobileNumber } })

    res.redirect('/ugRegularSem3List')
  } catch (error) {
    console.log(error)
  }
}


// BCA Part 3
const bca3List = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.id })
    const bca3AdmissionList = await bca3FormModel.find({ isPaid: true })
    // console.log(ugRegularSem1AdmissionList);
    res.render('bca3List', { list: bca3AdmissionList, status: "All", noOfForms: bca3AdmissionList.length, user })
  } catch (error) {
    console.log("Error in get bca3List", error)
  }
}


const findStuInbca3Adm = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.id })
    let { findStuMobileNo } = req.body
    if (findStuMobileNo !== '') {
      let foundStudent = await bca3FormModel.find({ mobileNumber: findStuMobileNo })
      res.render('bca3List', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

    } else if (findStuMobileNo === '') {
      const foundStudent = await bca3FormModel.find({ isPaid: true })
      res.render('bca3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
    }
  } catch (error) {
    console.log("Error in post findStuInbca3Adm", error)
  }
}


const bca3StuView = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params

    const foundStudent = await bca3FormModel.findOne({ _id: stuId })

    res.render('bca3StudentView', { foundStudent, user })
  } catch (error) {
    console.log("Error in get bca3StuView", error)
  }
}


const bca3StuEdit = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.id })
    const { stuId } = req.params
    const foundStudent = await bca3FormModel.findOne({ _id: stuId })
    res.render("bca3StudentEdit", { user, foundStudent })
  } catch (error) {
    console.log("Error in get bca3StuEdit", error)
  }
}


const bca3StuEditPost = async (req, res) =>{
  try {
    const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
    const { editId } = req.params

    await bca3FormModel.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await bca3FormModel.findOne({ _id: editId })
    await bca3UserModel.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, email, mobileNumber } })

    res.redirect('/bca3List')
  } catch (error) {
    console.log("Error in post bca3StuEditPost", error)
    
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
  deleteNotice,
  //ug regular sem 1 list
  ugRegularSem1List,
  findStuInUGRegSem1Adm,
  ugRegSem1StuView,
  verifyUgRegSem1Stu,
  datewiseUgRegSem1List,
  UG_Reg_Sem_I_BA_SS_Adm_List,
  UG_Reg_Sem_I_BA_Hum_Adm_List,
  UG_Reg_Sem_I_BSc_Adm_List,
  ugRegSem1Password,
  editUserId,
  editUserIdPost,
  findUserId,
  //ug regular sem 1 list
  ugRegularSem3List,
  findStuInUGRegSem3Adm,
  ugRegSem3StuView,
  ugRegSem3StuEdit,
  ugRegSem3StuEditPost,
  //BCA Part 3
  bca3List,
  findStuInbca3Adm,
  bca3StuView,
  bca3StuEdit,
  bca3StuEditPost
}
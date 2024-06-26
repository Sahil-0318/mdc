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

import ugRegularSem1AdmissionForm from "../models/userModel/ugRegularSem1AdmissionFormSchema.js"
import ugRegularSem1AdmissionPortal from "../models/userModel/ugRegularSem1AdmissionPortalSchema.js"

import ugRegularSem3User from "../models/userModel/UG-Regular-Sem-3/user.js"
import ugRegularSem3AdmissionForm from "../models/userModel/UG-Regular-Sem-3/admForm.js"


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

const ugRegSem1Excel = async (req, res) => {
  const { course, findAdmDateFrom, findAdmDateTo } = req.params
  console.log(course, findAdmDateFrom, findAdmDateTo)

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


  console.log(results)
  let users = []
  results.forEach((admUser) => {
    const { studentName, fatherName, motherName, referenceNumber, applicantId, ppuConfidentialNumber, dOB, gender, category, religion, aadharNumber, mobileNumber, email, address, policeStation, district, state, pinCode, paper1, collegeRollNo, admissionFee, receiptNo, paymentId, studentPhoto, studentSign } = admUser

    users.push({
      "Student's Name": studentName,
      "Father's Name": fatherName,
      "Mother's Name": motherName,
      "Reference No.": referenceNumber,
      "Applicant's Id": applicantId,
      "PPU Confidential Number": ppuConfidentialNumber,
      "College Roll No": collegeRollNo.slice(2),
      "Date of Birth": dOB,
      "Gender": gender,
      "Category": category,
      "Religion": religion,
      "Aadhar Number": aadharNumber,
      "Mobile Number": mobileNumber,
      "Email": email,
      "Address": `${address}, ${policeStation}, ${district}, ${state},  Pin Code-${pinCode}`,
      "Major Subject": paper1,
      "Admission Fee": admissionFee,
      "Receipt No": receiptNo,
      "Payment Id": paymentId,
      "Student Photo": studentPhoto,
      "Student Sign": studentSign

    })

    console.log(users)
    const csvParser = new CsvParser()
    const csvData = csvParser.parse(users)

    res.setHeader("Content-type", "text/csv")
    res.setHeader("Content-Disposition", `attachment: filename=${course}${findAdmDateFrom}-${findAdmDateTo}.csv`)

    res.status(200).end(csvData)

  })





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
        const foundStudent = await ugRegularSem1AdmissionPortal.find({ })
        res.render("ugRegSem1PasswordList", { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
    }

  } catch (error) {
    console.log(error)
  }
}


// UG Regular Sem 3 List

const ugRegularSem3List = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id })
    const ugRegularSem1AdmissionList = await ugRegularSem3AdmissionForm.find({ isPaid: true })
    // console.log(ugRegularSem1AdmissionList);
    res.render('ugRegularSem3List', { list: ugRegularSem1AdmissionList, status: "All", noOfForms: ugRegularSem1AdmissionList.length, user })
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
      res.render('ugRegularSem3List', { list: foundStudent, status: "All", formAlert: "Please, Enter Ref No", noOfForms: foundStudent.length, user })
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
    res.render("ugRegularSem3StudentEdit", {user, foundStudent, foundStudentID})
  } catch (error) {
    console.log(error)
  }
}


const ugRegSem3StuEditPost = async(req, res) =>{
  try {
    const {studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, course, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo} = req.body
    const { editId } = req.params

    await ugRegularSem3AdmissionForm.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, paper1, paper2, paper3, paper4, paper5, dOB, gender, category, religion, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

    const foundUserLogin = await ugRegularSem3AdmissionForm.findOne({ _id: editId })
    await ugRegularSem3User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName : studentName, course, email, mobileNumber } })

    res.redirect('/ugRegularSem3List')
  } catch (error) {
    console.log(error)
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
  ugRegSem1Excel,
  ugRegSem1Password,
  editUserId,
  editUserIdPost,
  findUserId,
  //ug regular sem 1 list
  ugRegularSem3List,
  findStuInUGRegSem3Adm,
  ugRegSem3StuView,
  ugRegSem3StuEdit,
  ugRegSem3StuEditPost
}
import User from '../models/userModel/userSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'
// import path from "path"
import * as path from 'path'
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync, existsSync, unlink } from "fs"

const recordRoomPage = async (req, res) => {
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


        return res.render('recordRoomPage', { studentsNumber, user, noOfStudents, category })
    } catch (error) {
        res.status(401)
    }
}

const interClcApprovedList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({ status: 'Approved', course: 'Intermediate', isIssued: "false" })

        res.render("clcApprovedList", { status: "'to be issue'", noOfForms: allClc.length, user, allClc })
    } catch (error) {
        res.status(401)
    }
}

const baClcApprovedList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({ status: 'Approved', course: 'B.A', isIssued: "false" })

        res.render("clcApprovedList", { status: "'to be issue'", noOfForms: allClc.length, user, allClc })
    } catch (error) {
        res.status(401)
    }
}

const bcomClcApprovedList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({ status: 'Approved', course: 'B.COM', isIssued: "false" })

        res.render("clcApprovedList", { status: "'to be issue'", noOfForms: allClc.length, user, allClc })
    } catch (error) {
        res.status(401)
    }
}

const bscClcApprovedList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({ status: 'Approved', course: 'B.SC', isIssued: "false" })

        res.render("clcApprovedList", { status: "'to be issue'", noOfForms: allClc.length, user, allClc })
    } catch (error) {
        res.status(401)
    }
}

const bcaClcApprovedList = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({ status: 'Approved', course: 'B.C.A', isIssued: "false" })

        res.render("clcApprovedList", { status: "'to be issue'", noOfForms: allClc.length, user, allClc })
    } catch (error) {
        res.status(401)
    }
}

const printCertificate = async (req, res) => {
    try {
        const { certificate, course, id } = req.params
        // console.log(certificate, course, id );
        
        const user = await User.findOne({ _id: req.id })
        let foundCertificate = ''
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issueDate = `${day}-${month}-${year}`

        function reverseString(str) {
            return str.split('-').reverse().join('-');
        }


        if (certificate === 'clc') {
            await clcSchema.findOneAndUpdate({ _id: id}, { $set: { dOLC: issueDate } })
            foundCertificate = await clcSchema.findOneAndUpdate({ _id: id}, { $set: { isIssued: true } })

            let reversedDOB = reverseString(foundCertificate.dOB);
        let reversedDOAdm = reverseString(foundCertificate.dOAdm);

        
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./CLC.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(105, 629);
        firstPage.drawText(`${foundCertificate.serialNo}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(431, 630);
        firstPage.drawText(` ${foundCertificate.studentId}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(350, 604);
        firstPage.drawText(`${foundCertificate.fullName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 576);
        firstPage.drawText(`${foundCertificate.fatherName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 550);
        firstPage.drawText(`${foundCertificate.motherName}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 523);
        firstPage.drawText(`${foundCertificate.aadharNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 497);
        firstPage.drawText(`${foundCertificate.parmanentAddress}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 471);
        firstPage.drawText(`${reversedDOB}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 444);
        firstPage.drawText(`${foundCertificate.course}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 417);
        firstPage.drawText(`${foundCertificate.session}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 390);
        firstPage.drawText(`${reversedDOAdm}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 363);
        firstPage.drawText(`${foundCertificate.classRollNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 336);
        firstPage.drawText(`${foundCertificate.dOLC}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 310);
        firstPage.drawText(`${foundCertificate.yearOfExam}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 284);
        firstPage.drawText(`${foundCertificate.resultDivision}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 258);
        firstPage.drawText(`${foundCertificate.regNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 231);
        firstPage.drawText(`${foundCertificate.uniRollNumber}`, {
            font: courierBoldFont,
            size: 12,
        });

        firstPage.moveTo(350, 204);
        firstPage.drawText(`${foundCertificate.remark}`, {
            font: courierBoldFont,
            size: 16,
        });

        firstPage.moveTo(85, 45);
        firstPage.drawText(`: ${foundCertificate.dOLC}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundCertificate.uniRollNumber + "_CLC.pdf", await document.save());
        let filename = "RollNo_" + foundCertificate.uniRollNumber + "_CLC.pdf"
        
        console.log('287');
        
        const filePath = path.join('D:/New BD College/BD College Site', filename);
        

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundCertificate.uniRollNumber}_CLC.pdf`,  (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('An error occurred');
                } else {
                    // Delete the file after 10 minutes
                    setTimeout(() => {
                        unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err}`);
                            } else {
                                console.log(`File ${filePath} deleted`);
                            }
                        });
                    }, 10 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }
        }

    } catch (error) {
        res.status(401)
    }
}



export {
    recordRoomPage,
    interClcApprovedList,
    baClcApprovedList,
    bcomClcApprovedList,
    bscClcApprovedList,
    bcaClcApprovedList,
    printCertificate
}
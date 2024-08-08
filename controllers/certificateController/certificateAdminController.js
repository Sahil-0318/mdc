import User from '../../models/userModel/userSchema.js'
import CC from '../../models/certificateModels/cc.js'
import TC from "../../models/certificateModels/tc.js"
import Bonafied from "../../models/certificateModels/bonafied.js"

import path from "path"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { writeFileSync, readFileSync, existsSync, unlink } from "fs"

// ====================== Character Certificate ================================
export const cclist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.collegeRollNumber && filterQueries.collegeRollNumber !== '') {
            query.collegeRollNumber = filterQueries.collegeRollNumber;
        }

        const cclist = await CC.find(query)
        res.render("ccAdmin", { user, cclist })
    } catch (error) {
        console.log("Error in cc list => ", error)
    }
}


export const downloadcc = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt: issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${foundcc.issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
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
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in cc download => ", error)
    }
}


// ====================== Character Certificate ================================
export const tclist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.collegeRollNumber && filterQueries.collegeRollNumber !== '') {
            query.collegeRollNumber = filterQueries.collegeRollNumber;
        }
        if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
            query.mobileNumber = filterQueries.mobileNumber;
        }

        const tclist = await TC.find(query)
        res.render("tcAdmin", { user, tclist })
    } catch (error) {
        console.log("Error in tc list => ", error)
    }
}


export const downloadtc = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })

        return res.send("This page is under development. Please Go Back")

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt: issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${foundcc.issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
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
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in tc download => ", error)
    }
}


// =========================== Bonafied ========================================
export const bonafiedlist = async (req, res) => {
    const filterQueries = req.query;
    try {
        const user = await User.findOne({ _id: req.id })

        const query = {};
        query.isPaid = true
        // Construct the query object based on filterQueries
        if (filterQueries.courseName && filterQueries.courseName !== 'all') {
            query.courseName = filterQueries.courseName;
        }
        if (filterQueries.fullName && filterQueries.fullName !== '') {
            query.fullName = filterQueries.fullName;
        }
        if (filterQueries.uniRegNumber && filterQueries.uniRegNumber !== '') {
            query.uniRegNumber = filterQueries.uniRegNumber;
        }
        if (filterQueries.mobileNumber && filterQueries.mobileNumber !== '') {
            query.mobileNumber = filterQueries.mobileNumber;
        }

        const bonafiedlist = await Bonafied.find(query)
        res.render("bonafiedAdmin", { user, bonafiedlist })
    } catch (error) {
        console.log("Error in bonafied list => ", error)
    }
}


export const downloadbonafied = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ _id: req.id })
        return res.send("This page is under development. Please Go Back")

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Add 1 as months are zero-based
        const year = currentDate.getFullYear();
        const issuedAt = `${day}-${month}-${year}`

        let foundcc = await CC.findOneAndUpdate({ _id: id }, { $set: { issuedAt: issuedAt } })
        //Create pdf
        const document = await PDFDocument.load(readFileSync("./Character.pdf"));
        const courierBoldFont = await document.embedFont(StandardFonts.Courier);
        const firstPage = document.getPage(0);

        firstPage.moveTo(100, 350);
        firstPage.drawText(`${foundcc.serialNo}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(580, 350);
        firstPage.drawText(` ${foundcc.studentId}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(305, 310);
        firstPage.drawText(`${foundcc.fullName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(272, 270);
        firstPage.drawText(`${foundcc.fatherName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(160, 230);
        firstPage.drawText(`${foundcc.motherName}`, {
            font: courierBoldFont,
            size: 18,
        });


        firstPage.moveTo(248, 192);
        firstPage.drawText(`${foundcc.courseName}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(600, 192);
        firstPage.drawText(`${foundcc.session}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(200, 152);
        firstPage.drawText(`${foundcc.collegeRollNumber}`, {
            font: courierBoldFont,
            size: 18,
        });

        firstPage.moveTo(76, 75);
        firstPage.drawText(`: ${foundcc.issuedAt}`, {
            font: courierBoldFont,
            size: 16,
        });


        writeFileSync("RollNo_" + foundcc.collegeRollNumber + "_Char.pdf", await document.save());
        let filename = "RollNo_" + foundcc.collegeRollNumber + "_Char.pdf"

        const filePath = path.join(filename);
        console.log(filePath);

        if (existsSync(filePath)) {
            // Send the PDF file as a download
            res.download(filePath, `RollNo_${foundcc.collegeRollNumber}_Char.pdf`, (err) => {
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
                    }, 2 * 1000); // 10 minutes in milliseconds
                }
            });
        } else {
            res.status(404).send('File not found');
        }


    } catch (error) {
        console.log("Error in bonafied download => ", error)
    }
}
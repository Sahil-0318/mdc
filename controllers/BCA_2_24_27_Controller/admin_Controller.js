import User from "../../models/userModel/userSchema.js"
import BCA_2_24_27_User from "../../models/userModel/BCA_2_24_27_Model/user_Model.js";
import BCA_2_24_27_Form from "../../models/userModel/BCA_2_24_27_Model/form_Model.js";
import Csv from 'json2csv'
const CsvParser = Csv.Parser

export const list = async (req, res) => {
    const filterQueries = req.query;
    try {
        // Find the user based on request ID
        const user = await User.findOne({ _id: req.id });

        // Initialize the query object
        const query = {};
        let status = "All"

        // Construct the query object based on filterQueries
        if (filterQueries.isPaid && filterQueries.isPaid !== 'all') {
            query.isPaid = filterQueries.isPaid === 'true';
            if (query.isPaid == true) {
                status = "Paid"
            } else {
                status = "Unpaid"
            }
        }
        if (filterQueries.category && filterQueries.category !== 'all') {
            query.category = filterQueries.category;
            status += " " + query.category
        }
        if (filterQueries.gender && filterQueries.gender !== 'all') {
            query.gender = filterQueries.gender;
            status += " " + query.gender
        }

        // Find students based on the constructed query
        const list = await BCA_2_24_27_Form.find(query)
        // console.log(bca3AdmissionList);
        res.render('BCA_2_24_27/admList', { list, status, noOfForms: list.length, user })
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> list", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}

export const listPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        let { findStuMobileNo } = req.body
        if (findStuMobileNo !== '') {
            let foundStudent = await BCA_2_24_27_Form.find({ mobileNumber: findStuMobileNo })
            res.render('BCA_2_24_27/admList', { list: foundStudent, status: "Found", noOfForms: foundStudent.length, user })

        } else if (findStuMobileNo === '') {
            const foundStudent = await BCA_2_24_27_Form.find({ isPaid: true })
            res.render('BCA_2_24_27/admList', { list: foundStudent, status: "All", formAlert: "Please, Enter Mobile No", noOfForms: foundStudent.length, user })
        }
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> listPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}

export const studentDetail = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { stuId } = req.params

        const foundStudent = await BCA_2_24_27_Form.findOne({ _id: stuId })

        res.render('BCA_2_24_27/studentDetail', { foundStudent, user })
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> studentDetail", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}

export const studentEdit = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { stuId } = req.params
        const foundStudent = await BCA_2_24_27_Form.findOne({ _id: stuId })
        res.render("BCA_2_24_27/studentEdit", { user, foundStudent })
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> studentEdit", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}

export const studentEditPost = async (req, res) => {
    try {
        const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } = req.body
        const { editId } = req.params

        await BCA_2_24_27_Form.findOneAndUpdate({ _id: editId }, { $set: { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, examResult, obtMarks, fullMarks, obtPercent, session, admissionFee, paymentId, receiptNo } })

        const foundUserLogin = await BCA_2_24_27_Form.findOne({ _id: editId })
        await BCA_2_24_27_User.findOneAndUpdate({ _id: foundUserLogin.appliedBy }, { $set: { fullName: studentName, email, mobileNumber } })

        res.redirect('/bca-3-23-26-list')
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> studentEditPost", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}

export const admList = async (req, res) => {
    try {
        const studentsBySubject = await BCA_2_24_27_Form.find({ isPaid: true })

        const userData = studentsBySubject.sort((a, b) => a.collegeRollNumber - b.collegeRollNumber);

        const users = userData.map(admUser => {
            const { studentName, fatherName, motherName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, category, aadharNumber, mobileNumber, address, district, policeStation, state, pinCode, subject, studentPhoto, studentSign, session, paymentSS, dateAndTimeOfPayment, receiptNo, admissionFee } = admUser;

            return {
                'Student Name': studentName,
                'Uni. Reg. Number': uniRegNumber,
                'Uni. Roll Number': uniRollNumber,
                'College Roll No.': collegeRollNumber,
                'Course': "BCA",
                'Session': session,
                'Aadhar No.': aadharNumber,
                'DOB': dOB,
                'Gender': gender,
                'Category': category,
                'Subject': subject,
                "Father's Name": fatherName,
                "Mother's Name": motherName,
                'Address': `ADDRESS - ${address}, DISTRICT - ${district}, P.S - ${policeStation}, ${state}, PIN - ${pinCode}`,
                'Mobile No.': mobileNumber,
                'Email': email,
                'Admission Fee': admissionFee,
                "Student's Photo": studentPhoto,
                "Student's Sign": studentSign,
                "Payment Receipt No.": receiptNo,
                "Admission Date": dateAndTimeOfPayment.slice(0, 10),
                "Payment SS": paymentSS
            };
        });

        const csvParser = new CsvParser();
        const csvData = csvParser.parse(users);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=BCA_Sem_3_23_26_Adm_List.csv");

        res.status(200).end(csvData);
    } catch (error) {
        console.log("Error in BCA_Sem_3_23_26_Controller >> admin-Controller >> admList", error);
        req.flash("flashMessage", ["Something went wrong", "alert-danger"]);
        return res.status(500).redirect("/bca-3-23-26-list");
    }
}
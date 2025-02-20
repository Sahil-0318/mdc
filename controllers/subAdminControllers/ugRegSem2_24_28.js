import User from '../../models/userModel/userSchema.js'
import ugRegularSem_2_24_28_Adm from '../../models/userModel/ugRegSem_2_24_28.js'
import FileUpload from '../../fileUpload/fileUpload.js'

export const subAdminPage = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        res.status(201).render('subAdminPage', { user })
    } catch (error) {
        console.log("Error in subAdminPage =====>", error)
    }
}


export const ugRegSem2_24_28_AdmForm = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        res.status(201).render('ugRegSem2_24_28_AdmForm', { user })
    } catch (error) {
        console.log("Error in ugRegSem2_24_28_AdmForm =====>", error)
    }
}


export const ugRegSem2_24_28_AdmFormPost = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const { course, studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examResult, obtMarks, fullMarks, obtPercent } = req.body


        const appliedUser = await ugRegularSem_2_24_28_Adm.findOne({ uniRegNumber })
        if (appliedUser) {
            return res.status(201).render('ugRegSem2_24_28_AdmForm', { user, alreadysubmitted: `Already submitted the form with this Uni. Reg.No ${uniRegNumber}` })
        }

        let admissionFee = ""

        const images = req.files
        // console.log(images[0].path);
        const photoUpload = await FileUpload(images[0].path)
        const photoURL = photoUpload.secure_url
        // console.log(photoURL);

        // console.log(images[1].path);
        const signUpload = await FileUpload(images[1].path)
        const signURL = signUpload.secure_url
        // console.log(signURL);

        // ===========
        if (gender === "MALE") {
            if (course === "BSC" || paper1 === "Psychology") {
                if (category === "GENERAL" || category === "BC-2") {
                    admissionFee = 2905
                } else if (category === "BC-1") {
                    admissionFee = 2305
                } else {
                    admissionFee = 1500
                }
            } else {
                if (category === "GENERAL" || category === "BC-2") {
                    admissionFee = 2305
                } else if (category === "BC-1") {
                    admissionFee = 1705
                } else {
                    admissionFee = 900
                }
            }

        } else {
            if (course === "BSC" || paper1 === "Psychology") {
                admissionFee = 1500
            } else {
                admissionFee = 900
            }
        }

        const newAdmissionForm = new ugRegularSem_2_24_28_Adm({
            course, studentName, fatherName, motherName, guardianName, uniRegNumber, uniRollNumber, collegeRollNumber, email, dOB, gender, religion, category, bloodGroup, physicallyChallenged, maritalStatus, aadharNumber, mobileNumber, whatsAppNumber, address, district, policeStation, state, pinCode, paper1, paper2, paper3, paper4, paper5, paper6, examResult, obtMarks, fullMarks, obtPercent,
            studentPhoto: photoURL,
            studentSign: signURL,
            appliedBy: user._id,
            admissionFee
        })

        await newAdmissionForm.save()
        res.redirect(`/ugRegularSem-2-24-28-Pay/${uniRegNumber}`)
    } catch (error) {
        console.log("Error in ugRegSem2_24_28_AdmFormPost =====>", error)
    }
}


export const ugRegularSem_2_24_28_Pay = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const {uniRegNumber} = req.params
        const appliedStudent = await ugRegularSem_2_24_28_Adm.findOne({ uniRegNumber })
        if (appliedStudent.isPaid === true) {
            return res.redirect(`/ugRegularSem-2-24-28-Receipt/${uniRegNumber}`)
        }
        res.status(201).render('ugRegSem2_24_28_Pay_Page', { user, appliedStudent })
    } catch (error) {
        console.log("Error in ugRegularSem_2_24_28_Pay =====>", error)
    }
}


export const ugRegularSem_2_24_28_PayPost = async (req, res) => {
    try {
        const { paymentMethod, refNo } = req.body;
        const { uniRegNumber } = req.params;
    
        // Fetch user and student details
        const [user, appliedStudent] = await Promise.all([
            User.findById(req.id),
            ugRegularSem_2_24_28_Adm.findOne({ uniRegNumber })
        ]);
    
        if (!appliedStudent) {
            return res.status(404).send("Student not found");
        }
    
        // Format date and time
        const dateAndTimeOfPayment = new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).replace(",", "");
    
        // Generate Receipt Number
        const receiptNo = `25MDC${appliedStudent.uniRollNumber}`;
    
        // Prepare update object
        const updateData = {
            dateAndTimeOfPayment,
            isPaid: true,
            paymentMethod,
            receiptNo
        };
    
        // Include UPI reference number if payment method is UPI
        if (paymentMethod === "UPI" && refNo && /^\d{12}$/.test(refNo)) {
            updateData.paymentId = refNo;
        }
    
        // Update database
        await ugRegularSem_2_24_28_Adm.findOneAndUpdate({ uniRegNumber }, { $set: updateData });
    
        // Render response
        res.redirect(`/ugRegularSem-2-24-28-Receipt/${uniRegNumber}`)
    } catch (error) {
        console.error("Error in ugRegularSem_2_24_28_PayPost:", error);
        res.status(500).send("Server error");
    }
}


export const ugRegularSem_2_24_28_Receipt = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const {uniRegNumber} = req.params
        const appliedUser = await ugRegularSem_2_24_28_Adm.findOne({ uniRegNumber })

        if (appliedUser == null) {
            return res.status(201).render('ugRegSem2_24_28_AdmForm', { user, alreadysubmitted: `Uni. Reg.No ${uniRegNumber} has not submitted the admission form` })
        }

        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem_2_24_28_Receipt", { appliedUser, user })
        } else {
            res.redirect(`/ugRegularSem-2-24-28-Pay/${uniRegNumber}`)
        }
    } catch (error) {
        console.log("Error in ugRegularSem_2_24_28_Receipt =====>", error)
    }
}


export const ugRegularSem_2_24_28_Form = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.id })
        const {uniRegNumber} = req.params
        const appliedUser = await ugRegularSem_2_24_28_Adm.findOne({ uniRegNumber })
        if (appliedUser == null) {
            return res.status(201).render('ugRegSem2_24_28_AdmForm', { user, alreadysubmitted: `Uni. Reg.No ${uniRegNumber} has not submitted the admission form` })
        }

        if (appliedUser.isPaid === true) {
            res.render("ugRegularSem_2_24_28_Form", { appliedUser, user })
        } else {
            res.redirect(`/ugRegularSem-2-24-28-Pay/${uniRegNumber}`)
        }
    } catch (error) {
        console.log("Error in ugRegularSem_2_24_28_Receipt =====>", error)
    }
}



export const subAdminPageLogout = async (req, res) => {
    res.clearCookie("uid");
    // res.status(201).redirect('https://www.mdcollegenaubatpur.ac.in/')
    res.status(201).redirect('/login')
}
import User from '../models/userModel/userSchema.js'
import AdmissionForm from '../models/userModel/admissionFormSchema.js'
import clcSchema from '../models/userModel/clcSchema.js'

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

const interClcApprovedList = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({status : 'Approved', course : 'Intermediate', isIssued : "false"})
        
        res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
    } catch (error) {
        res.status(401)
    }
}

const baClcApprovedList = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({status : 'Approved', course : 'B.A', isIssued : "false"})
        
        res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
    } catch (error) {
        res.status(401)
    }
}

const bcomClcApprovedList = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({status : 'Approved', course : 'B.COM', isIssued : "false"})
        
        res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
    } catch (error) {
        res.status(401)
    }
}

const bscClcApprovedList = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({status : 'Approved', course : 'B.SC', isIssued : "false"})
        
        res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
    } catch (error) {
        res.status(401)
    }
}

const bcaClcApprovedList = async (req, res) =>{
    try {
        const user = await User.findOne({ _id: req.id })
        const allClc = await clcSchema.find({status : 'Approved', course : 'B.C.A', isIssued : "false"})
        
        res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
    } catch (error) {
        res.status(401)
    }
}

const downloadClc = async (req, res) =>{
    try {
        const {certificate, course, id} = req.params
        // console.log(certificate, course, id );
        const user = await User.findOne({ _id: req.id })

        if (certificate === 'clc') {
            const foundClc = await clcSchema.find({course , _id : id})
            // res. send(foundClc)
            res.send(`
        <script>
            window.open('/generate-pdf', '_blank');
            setTimeout(() => window.print(), 1000); // Wait for the PDF to load before printing
        </script>
    `);
        }

        // const allClc = await clcSchema.find({status : 'Approved', course : 'B.C.A', isIssued : "false"})
        
        // res.render("clcApprovedList", {status: "'to be issue'", noOfForms: allClc.length, user, allClc})
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
    downloadClc
}
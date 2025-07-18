import mongoose from "mongoose";
const bcaStudentSchema = mongoose.Schema({
    courseSession: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        default: null
    },
    motherName: {
        type: String,
    },
    guardianName: {
        type: String,
    },
    referenceNumber: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    applicantId: {
        type: String,
    },
    dOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    familyAnnualIncome: {
        type: Number
    },
    religion: {
        type: String
    },
    category: {
        type: String,
    },
    bloodGroup: {
        type: String
    },
    physicallyChallenged: {
        type: String
    },
    maritalStatus: {
        type: String
    },
    aadharNumber: {
        type: Number
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    whatsAppNumber: {
        type: Number
    },
    address: {
        type: String
    },
    district: {
        type: String
    },
    policeStation: {
        type: String
    },
    state: {
        type: String
    },
    pinCode: {
        type: Number
    },
    subject:{
        type : String,
        default: "Computer Application"
    },
    ppuConfidentialNumber: {
        type: String
    },
    studentPhoto: {
        type: String
    },
    studentSign: {
        type: String
    },
    collegeRollNo: {
        type: String
    },
    uniRegNumber:{
        type : String,
    },
    uniRollNumber:{
        type : String,
    },

    // Part detail references (ObjectId links to other schemas)
    part1AdmForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bcapart1admform',
        default: null,
        required: false
            
    },
    part2AdmForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bcapart2admform',
        default: null,
        required: false
    },
    part3AdmForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bcapart3admform',
        default: null,
        required: false
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
})

const BCAStudent = mongoose.model("bcastudent", bcaStudentSchema)
export default BCAStudent
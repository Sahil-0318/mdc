import mongoose from 'mongoose'

const ug_reg_sem_1_25_29_adm_form_schema = mongoose.Schema({
    studentName:{
        type : String,
        required : true
    },
    fatherName:{
        type : String,
        required : true
    },
    motherName:{
        type : String,
        required : true
    },
    guardianName:{
        type : String,
        required : true
    },
    referenceNumber:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    applicantId:{
        type : String,
        required : true
    },
    dOB:{
        type : String,
        required : true
    },
    gender:{
        type : String,
        required : true
    },
    familyAnnualIncome:{
        type : String,
        required : true
    },
    religion:{
        type : String,
        required : true
    },
    category:{
        type : String,
        required : true
    },
    bloodGroup:{
        type : String,
        required : true
    },
    physicallyChallenged:{
        type : String,
        required : true
    },
    maritalStatus:{
        type : String,
        required : true
    },
    aadharNumber:{
        type : Number,
        required : true
    },
    mobileNumber:{
        type : Number,
        required : true
    },
    whatsAppNumber:{
        type : Number,
        required : true
    },
    address:{
        type : String,
        required : true
    },
    district:{
        type : String,
        required : true
    },
    policeStation:{
        type : String,
        required : true
    },
    state:{
        type : String,
        required : true
    },
    pinCode:{
        type : Number,
        required : true
    },
    paper1:{
        type : String,
        required : true
    },
    paper2:{
        type : String,
        required : true
    },
    paper3:{
        type : String,
        required : true
    },
    paper4:{
        type : String,
        required : true
    },
    paper5:{
        type : String,
        required : true
    },
    paper6:{
        type : String,
        required : true
    },
    examName:{
        type : String,
        required : true
    },
    examBoard:{
        type : String,
        required : true
    },
    examYear:{
        type : Number,
        required : true
    },
    examResult:{
        type : String,
        required : true
    },
    obtMarks:{
        type : String,
        required : true
    },
    fullMarks:{
        type : String,
        required : true
    },
    obtPercent:{
        type : String,
        required : true
    },
    ppuConfidentialNumber :{
        type : String,
        required : true
    },
    studentPhoto: {
        type : String,
        required : true
    },
    studentSign: {
        type : String,
        required : true
    },
    appliedBy: {
        type : String,
        required : true
    },
    admissionFee : {
        type : String
    },
    session :{
        type : String,
        default : "2025-29"
    },
    collegeRollNo :{
        type : String
    },
    isPaid :{
        type : Boolean,
        default : false
    },
    paymentDetails :{
        type : Object,
        default : {}
    },
    receiptNo :{
        type : String
    },
    // Backup pay
    paymentSS :{
        type : String
    },
    paymentId :{
        type : String
    },
    dateAndTimeOfPayment :{
        type : String
    },

    
})

const Ug_reg_sem_1_25_29_adm_form = mongoose.model("ug_reg_sem_1_25_29_adm_form", ug_reg_sem_1_25_29_adm_form_schema)
export default Ug_reg_sem_1_25_29_adm_form
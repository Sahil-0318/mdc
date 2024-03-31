import mongoose from 'mongoose'


const clcSchema = new mongoose.Schema({
    fName:{
        type : String,
        required : true
    },
    lName: {
        type : String,
        required : true,
    },
    collegeClass: {
        type : String,
        required : true,
    },
    classRoll: {
        type : Number,
        required : true,
    },
    session: {
        type : String,
        required : true,
    },
    dOB: {
        type : String,
        default: Date.now,
        required : true,
    },
    uniRollNumber: {
        type : Number,
        required : true,
    },
    registrationNumber: {
        type : Number,
        required : true,
    },
    yOPUniEx: {
        type : Number,
        required : true,
    },
    subTaken: {
        type : String,
        required : true,
    },
    fatherName: {
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
    },
    isApprove :{
        type: Boolean,
        default: false
    },
    appliedBy: {
        type : String,
        required : true
    }
}, {timestamps:true})

export default mongoose.model("Clc", clcSchema)

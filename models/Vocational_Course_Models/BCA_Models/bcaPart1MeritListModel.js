import mongoose from 'mongoose'

const bcaPart1MeritListSchema = mongoose.Schema({
    referenceNumber: {
        type: String
    },
    studentName: {
        type: String
    },
    fatherName: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    email: {
        type: String
    },
    gender: {
        type: String
    },
    dOB: {
        type: String
    }
});

const BCAPart1MeritList = mongoose.model('bcapart1meritlist', bcaPart1MeritListSchema);
export default BCAPart1MeritList


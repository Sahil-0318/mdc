
import mongoose from "mongoose";

const bcaPart1AdmFormSchema = mongoose.Schema({
    courseSession: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        required: true
    },
    examBoard: {
        type: String,
        required: true
    },
    examYear: {
        type: Number,
        required: true
    },
    examResult: {
        type: String,
        required: true
    },
    obtMarks: {
        type: String,
        required: true
    },
    fullMarks: {
        type: String,
        required: true
    },
    obtPercent: {
        type: String,
        required: true
    },
    appliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bcastudent',
        required: true
    },
    admissionFee: {
        type: Number,
        default: 15000
    },
    extraFee: {
        type: String
    },
    totalFee: {
        type: String
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String
    },
    paymentScreenshot: {
        type: String
    },
    dateAndTimeOfPayment: {
        type: String
    },
    receiptNo: {
        type: String
    }

})
const BCAPart1AdmForm = mongoose.model("bcapart1admform", bcaPart1AdmFormSchema)
export default BCAPart1AdmForm
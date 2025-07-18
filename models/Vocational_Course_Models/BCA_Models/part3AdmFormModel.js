
import mongoose from "mongoose";

const bcaPart3AdmFormSchema = mongoose.Schema({
    courseSession: {
        type: String,
        required: true
    },
    examName: {
        type: String,
        default: "BCA Part 2"
    },
    examBoard: {
        type: String,
        default: "BSEB"
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
        type: String
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
const BCAPart3AdmForm = mongoose.model("bcapart3admform", bcaPart3AdmFormSchema)
export default BCAPart3AdmForm
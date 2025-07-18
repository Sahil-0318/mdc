
import mongoose from "mongoose";

const bcaPart2AdmFormSchema = mongoose.Schema({
        courseSession: {
            type: String,
            required: true
        },
        examName: {
            type: String,
            default: "BCA Part 1"
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
const BCAPart2AdmForm = mongoose.model("bcapart2admform", bcaPart2AdmFormSchema)
export default BCAPart2AdmForm
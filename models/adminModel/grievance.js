import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    rollNo: {
        type: String,
        required: true,
        trim: true
    },
    program: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    grievanceAgainst: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    }
});

const Grievance = mongoose.model("grievance", grievanceSchema);
export default Grievance

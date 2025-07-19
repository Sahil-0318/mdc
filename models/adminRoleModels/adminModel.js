import mongoose from "mongoose";
const adminModelSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
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
    role: {
        type: String,
        required: true
    }
})

const AdminModel = mongoose.model("adminmodel", adminModelSchema)
export default AdminModel
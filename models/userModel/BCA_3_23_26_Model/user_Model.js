import mongoose from 'mongoose'

const BCA_3_23_26_User_Schema  = mongoose.Schema({
    fullName:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    mobileNumber :{
        type : Number,
        required : true
    },
    userId : {
        type : String
    },
    password: {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})

const BCA_3_23_26_User = mongoose.model("bca32326User", BCA_3_23_26_User_Schema)
export default BCA_3_23_26_User
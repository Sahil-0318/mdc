import mongoose from 'mongoose'

const BCA_2_24_27_User_Schema  = mongoose.Schema({
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

const BCA_2_24_27_User = mongoose.model("bca22427User", BCA_2_24_27_User_Schema)
export default BCA_2_24_27_User
import mongoose from 'mongoose'

const ugRegularSem2_24_28_UserSchema = mongoose.Schema({
    course:{
        type : String,
        required : true
    },
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
    isPaid:{
        type : Boolean,
        default : false
    }
    
})
const ugRegularSem2_24_28_User = mongoose.model("ugRegularSem2_24_28_User", ugRegularSem2_24_28_UserSchema)
export default ugRegularSem2_24_28_User
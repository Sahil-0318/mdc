import mongoose from 'mongoose'

const Ug_Reg_Sem_1_25_29_User_Schema = mongoose.Schema({
    course:{
        type : String,
        required : true
    },
    referenceNumber:{
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
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})
const Ug_Reg_Sem_1_25_29_User = mongoose.model("ugRegSem12529User", Ug_Reg_Sem_1_25_29_User_Schema)
export default Ug_Reg_Sem_1_25_29_User
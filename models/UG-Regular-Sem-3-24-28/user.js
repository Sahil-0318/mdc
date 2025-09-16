import mongoose from 'mongoose'

const Ug_Reg_Sem_3_24_28_User_Schema = mongoose.Schema({
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
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})

const Ug_Reg_Sem_3_24_28_User = mongoose.model("ugRegSem32428User", Ug_Reg_Sem_3_24_28_User_Schema)
export default Ug_Reg_Sem_3_24_28_User
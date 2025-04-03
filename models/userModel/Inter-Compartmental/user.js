import mongoose from 'mongoose'

const interCompartmentUserSchema = mongoose.Schema({
    faculty: {
        type: String
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
    },
    isFormFilled:{
        type : Boolean,
        default : false
    }
    
})

const interCompartmentUser = mongoose.model("interCompartmentUser", interCompartmentUserSchema)

export default interCompartmentUser
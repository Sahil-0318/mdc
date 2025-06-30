import mongoose from 'mongoose'

const Ug_Reg_Sem_1_25_29_ML_3_Schema = mongoose.Schema({
    srNo: {
        type: Number
    },
    appNo: {
        type: String
    },
    candidateName: {
        type: String
    },
    majorSubject: {
        type: String
    }
});

const Ug_Reg_Sem_1_25_29_ML_3 = mongoose.model('ugRegSem12529ML3', Ug_Reg_Sem_1_25_29_ML_3_Schema);

export default Ug_Reg_Sem_1_25_29_ML_3


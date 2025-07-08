import mongoose from 'mongoose'

const Ug_Reg_Sem_1_25_29_ML_4_Schema = mongoose.Schema({
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

const Ug_Reg_Sem_1_25_29_ML_4 = mongoose.model('ugRegSem12529ML4', Ug_Reg_Sem_1_25_29_ML_4_Schema);

export default Ug_Reg_Sem_1_25_29_ML_4


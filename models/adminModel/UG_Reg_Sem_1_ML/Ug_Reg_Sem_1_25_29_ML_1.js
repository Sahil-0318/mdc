import mongoose from 'mongoose'

const Ug_Reg_Sem_1_25_29_ML_1_Schema = mongoose.Schema({
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

const Ug_Reg_Sem_1_25_29_ML_1 = mongoose.model('ugRegSem12529ML1', Ug_Reg_Sem_1_25_29_ML_1_Schema);

export default Ug_Reg_Sem_1_25_29_ML_1


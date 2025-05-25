import mongoose from 'mongoose'

const Ug_Reg_Sem_1_25_29_ML_1_Schema = mongoose.Schema({
    srNo: {
        type: Number
    },
    // type: {
    //     type: String
    // },
    // ovrRnk: {
    //     type: Number
    // },
    // catRnk: {
    //     type: Number
    // },
    // resRnk: {
    //     type: Number
    // },
    // pref: {
    //     type: Number
    // },
    appNo: {
        type: String
    },
    candidateName: {
        type: String
    },
    // vert: {
    //     type: String
    // },
    // gender: {
    //     type: String
    // },
    // dOB: {
    //     type: String
    // },
    fatherName: {
        type: String
    },
    // domicile: {
    //     type: String
    // },
    // mobileNo: {
    //     type: Number
    // },
    // email: {
    //     type: String
    // },
    // board: {
    //     type: String
    // },
    // twelthRoll: {
    //     type: Number
    // },
    // twelthStream: {
    //     type: String
    // },
    // twelthPer: {
    //     type: Number
    // },
    // meritIndex: {
    //     type: Number
    // },
    majorSubject: {
        type: String
    }
});

const Ug_Reg_Sem_1_25_29_ML_1 = mongoose.model('ugRegSem12529ML1', Ug_Reg_Sem_1_25_29_ML_1_Schema);

export default Ug_Reg_Sem_1_25_29_ML_1


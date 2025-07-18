import mongoose from 'mongoose'

const vocationalAdmPortalSchema = mongoose.Schema({
    degree: {
        type: String
    },
    courseSession: {
        type: String
    },
    isPart1Active: {
        type: Boolean,
        default: false
    },
    isPart1AdmActive: {
        type: Boolean,
        default: false
    },
    isPart2Active: {
        type: Boolean,
        default: false
    },
    isPart2AdmActive: {
        type: Boolean,
        default: false
    },
    isPart3Active: {
        type: Boolean,
        default: false
    },
    isPart3AdmActive: {
        type: Boolean,
        default: false
    },
});

const VocationalAdmPortal = mongoose.model('vocationaladmportal', vocationalAdmPortalSchema);
export default VocationalAdmPortal


import mongoose from 'mongoose'

const ugRegularPortalStatusSchema = mongoose.Schema({
    courseSession: {
        type: String
    },
    sem1Portal: {
        type: Boolean,
        default: false
    },
    sem1AdmPortal: {
        type: Boolean,
        default: false
    },
    sem2Portal: {
        type: Boolean,
        default: false
    },
    sem2AdmPortal: {
        type: Boolean,
        default: false
    },
    sem3Portal: {
        type: Boolean,
        default: false
    },
    sem3AdmPortal: {
        type: Boolean,
        default: false
    },
    sem4Portal: {
        type: Boolean,
        default: false
    },
    sem4AdmPortal: {
        type: Boolean,
        default: false
    },
    sem5Portal: {
        type: Boolean,
        default: false
    },
    sem5AdmPortal: {
        type: Boolean,
        default: false
    },
    sem6Portal: {
        type: Boolean,
        default: false
    },
    sem6AdmPortal: {
        type: Boolean,
        default: false
    },
    sem7Portal: {
        type: Boolean,
        default: false
    },
    sem7AdmPortal: {
        type: Boolean,
        default: false
    },
    sem8Portal: {
        type: Boolean,
        default: false
    },
    sem8AdmPortal: {
        type: Boolean,
        default: false
    }
});

const UgRegularPortalStatus = mongoose.model('ugregularportalstatus', ugRegularPortalStatusSchema);
export default UgRegularPortalStatus


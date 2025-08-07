import mongoose from 'mongoose'

const ugRegularMeritListSchema = mongoose.Schema({
    meritListNumber: {
        type: String,
        trim: true
    },
    referenceNumber: {
        type: String,
        trim: true
    },
    studentName: {
        type: String,
        trim: true
    },
    fatherName: {
        type: String,
        trim: true
    },
    majorSubject: {
        type: String,
        trim: true
    }
});

const UgRegularMeritList = mongoose.model('ugregularmeritlist', ugRegularMeritListSchema);
export default UgRegularMeritList


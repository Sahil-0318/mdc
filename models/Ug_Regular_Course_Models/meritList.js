import mongoose from 'mongoose'

const ugRegularMeritListSchema = mongoose.Schema({
    referenceNumber: {
        type: String
    },
    studentName: {
        type: String
    },
    fatherName: {
        type: String
    },
    majorSubject: {
        type: String
    }
});

const UgRegularMeritList = mongoose.model('ugregularmeritlist', ugRegularMeritListSchema);
export default UgRegularMeritList


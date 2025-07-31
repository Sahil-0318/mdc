import notice from '../models/adminModel/noticeSchema.js'
import Grievance from '../models/adminModel/grievance.js'

const noticeAPI = async (req, res) => {
    try {
        const notices = await notice.find()
        res.status(200).json({
            success: true,
            notices
        })
    } catch (error) {
        console.log("Error in notice API", error)
    }
}
export const grievancesAPI = async (req, res) => {
    try {
        const grievance = new Grievance(req.body);
        await grievance.save();
        res.status(200).json({ message: "Grievance submitted successfully" });
    } catch (err) {
        console.error("Grievance submission error:", err);
        res.status(400).json({ message: "Failed to submit grievance", error: err });
    }
}

export { noticeAPI }
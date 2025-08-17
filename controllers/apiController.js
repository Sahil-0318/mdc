import notice from '../models/adminModel/noticeSchema.js'
import Grievance from '../models/adminModel/grievance.js'
import Gallery from '../models/Frontend_Model/galleryModel.js'

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
export const imageGalleryAPI = async (req, res) => {
    try {
        const galleryImages = await Gallery.find({type : "image"}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            galleryImages
        })
    } catch (err) {
        console.error("imageGalleryAPI error:", err);
    }
}

export { noticeAPI }
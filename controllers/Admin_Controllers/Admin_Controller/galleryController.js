import User from "../../../models/userModel/userSchema.js"
import Gallery from "../../../models/Frontend_Model/galleryModel.js";
import { uploadGalleryImage } from "../../../middlewares/mediaMiddleware.js";
import { deleteImage } from "../../../middlewares/mediaMiddleware.js";

export const imageGallery = async (req, res) => {
    try {
        // Find the user based on request ID
        const user = await User.findOne({ _id: req.id });
        const gallery = await Gallery.find({type : "image"}).sort({ createdAt: -1 });

        let data = {
            pageTitle: `Images Gallery`,
            gallery
        }

        res.render('Admin/galleryImages', { message: req.flash("flashMessage"), data, user })
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> galleryController >> imageGallery :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"])
        return res.redirect(`/admin/image-gallery`);
    }
}

export const imageGalleryPost = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            req.flash("flashMessage", ["No images uploaded!", "alert-danger"]);
            return res.redirect(`/admin/image-gallery`);
        }

        console.log(`Total files: ${req.files.length}`);

        // Upload all images in parallel
        const uploadResults = await Promise.all(
            req.files.map(async (file, index) => {
                console.log(`Uploading image ${index + 1}/${req.files.length}...`);
                const result = await uploadGalleryImage(file.buffer);

                // Save in DB
                await Gallery.create({
                    type: "image",
                    url: result.secure_url,
                });

                console.log(`✅ Uploaded & saved image ${index + 1}`);
                return result;
            })
        );

        console.log("All images uploaded:", uploadResults.length);

        req.flash("flashMessage", ["Images Uploaded Successfully ..", "alert-success"]);
        return res.redirect(`/admin/image-gallery`);
    } catch (error) {
        console.error("Error in Controllers >> Admin_Controllers >> Admin_Controller >> galleryController >> imageGalleryPost :", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect(`/admin/image-gallery`);
    }
};


export const deleteGalleryImage = async (req, res) => {
    try {
        const imageId = req.params.id;

        // 1. Find image in DB
        const image = await Gallery.findById(imageId);
        if (!image) {
            req.flash("flashMessage", ["Image not found in DB", "alert-danger"]);
            return res.redirect("/admin/image-gallery");
        }

        // 2. Try deleting from Cloudinary
        const deletedImageStatus = await deleteImage(image.url);

        if (deletedImageStatus) {
            // 3. Only delete from MongoDB if Cloudinary deletion succeeded
            await Gallery.findByIdAndDelete(imageId);

            req.flash("flashMessage", ["Image deleted successfully", "alert-success"]);
        } else {
            req.flash("flashMessage", ["Failed to delete image from Cloudinary", "alert-danger"]);
        }

        return res.redirect("/admin/image-gallery");
    } catch (error) {
        console.error("Error in deleteGalleryImage controller:", error);
        req.flash("flashMessage", ["Something went wrong !!", "alert-danger"]);
        return res.redirect("/admin/image-gallery");
    }
};


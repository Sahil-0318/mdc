import multer from 'multer'
import streamifier from "streamifier";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

// Upload photo and sign function
import sharp from "sharp";
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_USER_SECRET,
    secure: true,
});

export const uploadFile = async (filePath) => {
    try {
        // Resize and compress the image using sharp
        const processedImage = await sharp(filePath)
            .resize({ width: 500 })
            .jpeg({ quality: 70 })
            .toBuffer();

        // Upload the processed image to Cloudinary
        // Return a promise that will be resolved or rejected based on the Cloudinary upload result
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({
                resource_type: 'image',
                format: 'jpg',
            }, (error, result) => {
                if (error) {
                    reject(new Error('Cloudinary upload failed'));
                } else {
                    resolve(result);
                }
            });

            // Pipe the processed image buffer to the Cloudinary upload stream
            stream.end(processedImage);
        });
    } catch (error) {
        console.log('Upload error', error.message);
        console.log('Upload error', error);

    }
};


// Multer setup
const storageExcel = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './excelUploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `merit-${Date.now()}-${file.originalname}`);
    },
});

export const uploadExcel = multer({ storage: storageExcel });

export const uploadGalleryImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            {
                resource_type: "image",
                quality: "auto:best", // ensures best quality
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        // push the buffer into the upload stream
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


export const deleteImage = async (imageUrl) => {
    try {
        if (!imageUrl) return false;

        // Extract public_id from the URL
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1]; // e.g., "abc123.jpg"
        const publicId = fileName.split(".")[0];        // "abc123"

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            console.log(`✅ Cloudinary image deleted: ${publicId}`);
            return true;
        } else {
            console.log(`⚠️ Cloudinary deletion skipped/not found: ${publicId}`);
            return false;
        }
    } catch (error) {
        console.error("❌ Error deleting image from Cloudinary:", error);
        return false; // fail silently but allow DB deletion
    }
};
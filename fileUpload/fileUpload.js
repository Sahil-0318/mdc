import cloudinary from 'cloudinary'
// dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_SECRET,
  // timeout: 60000, // Set timeout to 60 seconds
  secure: true,
});

const uploadFile = async (filePath) => {
    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(filePath);
      // console.log(result);
      return result;
    } catch (error) {
      console.log('Upload error', error.message);
      console.log('Upload error', error);
      
    }
};

export default uploadFile
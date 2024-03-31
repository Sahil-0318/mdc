import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_USER_SECRET,
  secure: true,
});

const uploadFile = async (filePath) => {
    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(filePath, { folder: "BD College Admission Photo", use_filename: true });
    //   console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
};

export default uploadFile
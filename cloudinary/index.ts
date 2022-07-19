const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

export async function uploadImage(base64ImageURL: string) {
  const options = {
    upload_preset: process.env.CLOUDINARY_POST_PRESET,
  };

  try {
    const result = await cloudinary.uploader.upload(base64ImageURL, options);
    return result;
  } catch (error) {
    console.error(error);
  }
}

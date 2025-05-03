import dotenv from 'dotenv';
dotenv.config();

export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
export const uploadUrl = process.env.CLOUDINARY_UPLOAD_URL;
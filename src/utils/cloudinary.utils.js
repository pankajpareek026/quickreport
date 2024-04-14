// const cloudinarySystem = require('cloudinary').v2;
import { v2 as cloudinarySystem } from 'cloudinary'
cloudinarySystem.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export { cloudinarySystem as cloudinary };
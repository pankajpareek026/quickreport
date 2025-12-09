const cloudinary = require('cloudinary').v2;
const axios = require('axios');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} fileName - Original file name
 * @param {String} folder - Folder path in Cloudinary (optional)
 * @returns {Promise} Cloudinary upload result
 */
const uploadToCloudinary = async (fileBuffer, fileName, folder = 'quickreport/uploads') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: 'raw', // For CSV/JSON files
      public_id: `${Date.now()}_${fileName.replace(/\s+/g, '_')}`,
      overwrite: false,
      invalidate: true
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Get file content from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<String>} File content as string
 */
const getFileFromCloudinary = async (publicId) => {
  try {
    const url = cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true
    });

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch file from Cloudinary: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  getFileFromCloudinary,
  deleteFromCloudinary,
  cloudinary
};


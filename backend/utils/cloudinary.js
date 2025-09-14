const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'hap') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: 'auto'
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete error: ${error.message}`);
  }
};

// Generate QR code
const generateQRCode = async (data, options = {}) => {
  try {
    const qrCodeUrl = cloudinary.url(`qr_${Date.now()}`, {
      resource_type: 'image',
      transformation: [
        {
          width: options.width || 200,
          height: options.height || 200,
          crop: 'scale'
        }
      ]
    });

    return qrCodeUrl;
  } catch (error) {
    throw new Error(`QR code generation error: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  generateQRCode
};

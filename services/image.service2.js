const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

class ImageService2{
  constructor() {
    cloudinary.config({ 
      cloud_name: 'hieucuopbien123', 
      api_key: '862965956877381', 
      api_secret: process.env.CLOUDINARY_SECRET 
    });
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "test",
        resource_type: 'auto',
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname); 
      }
    });
    this.uploadCloud = multer({ storage, limits: { fileSize: 1 * 1000 * 1000 } });
  }
}

let imageService2 = new ImageService2();

module.exports = imageService2.uploadCloud;
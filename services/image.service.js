const multer = require("multer");
const path = require("path");

class ImageService {
  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../tmp"));    
      },
      filename: (req, file, cb) => {
        const originalName = file.originalname.split(".");
        cb(null, file.fieldname + "_" + Date.now() + "." + originalName[originalName.length - 1]);
      }
    });
    this.upload = multer({
      storage: storage,
      limits: { fileSize: 1 * 1000 * 1000 }
    });
  }
}

let imageService = new ImageService();

module.exports = imageService.upload;
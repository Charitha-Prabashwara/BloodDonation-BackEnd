const storage = require('./storage');
const fileFilter = require('./fileFilter');

const ImagUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image');

module.exports = ImagUpload;
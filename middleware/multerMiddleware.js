// Middleware to handle Multer upload
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return next({
        status: 400,
        message: err.message,
        code: 'MULTER_ERROR'
      });
    } else if (err) {
      // An unknown error occurred
      return next({
        status: 500,
        message: err.message,
        code: 'UPLOAD_ERROR'
      });
    }
    
    if (!req.file) {
      return next({
        status: 400,
        message: 'No file uploaded',
        code: 'NO_FILE'
      });
    }
    
    next();
  });
};

module.exports = handleUpload;
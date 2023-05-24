const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();

const multerConfig = {
  upload: multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
      const isValidMimeType = Object.keys(MIME_TYPES).includes(file.mimetype);
      const isValidExtension = isValidMimeType && MIME_TYPES[file.mimetype] === file.originalname.split('.').pop().toLowerCase();
      isValidExtension ? callback(null, true) : callback(new Error('Invalid file type.'));
    }
  }).single('image'),

  uploadImage: (req, res, next) => {
    if (!req.file) {
      return next();
    }

    const { buffer } = req.file;
    const fileName = Date.now() + '.webp';

    sharp(buffer)
      .toFormat('webp')
      .webp({ quality: 5 })
      .toFile('images/' + fileName)
      .then(() => {
        req.file.filename = fileName;
        next();
      })
      .catch(error => {
        console.error('Error occurred while converting image to WebP:', error);
        next(error);
      });
  }
};

module.exports = multerConfig;

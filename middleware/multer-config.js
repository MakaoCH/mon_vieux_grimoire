const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({ storage }).single('image');

const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { buffer, originalname } = req.file;
  const { name, ext } = path.parse(originalname);
  const fileName = `${Date.now()}-${name.replace(/\s/g, '_')}.webp`;

  const extensions = ['.png', '.jpg', '.jpeg'];
  const fileExtension = ext.toLowerCase();

  if (!extensions.includes(fileExtension)) {
    const error = new Error('Le format d\'image n\'est pas pris en charge.');
    error.status = 400;
    return next(error);
  }

  try {
    await sharp(buffer)
      .toFormat('webp')
      .webp({ quality: 5 })
      .toFile(`images/${fileName}`);

    req.file.filename = fileName;
    next();
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'enregistrement de l\'image convertie:', error);
    next(error);
  }
};

module.exports = {  upload,  uploadImage};



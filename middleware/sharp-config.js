const sharp = require('sharp');
const path = require('path');

const resizeImage = async (req, res, next) => {
    if (!req.file) {
      return next();
    }
  
    const { buffer, originalname } = req.file;
    const { name, ext } = path.parse(originalname);
    const fileName = `${name.replace(/\s/g, '_')}.webp`;
  
 
    try {
      await sharp(buffer)
        .toFormat('webp')
        .webp({ quality: 20 })
        .toFile(`images/${fileName}`);
  
      req.file.filename = fileName;
      next();
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'enregistrement de l\'image convertie:', error);
      next(error);
    }
  };

module.exports = resizeImage;

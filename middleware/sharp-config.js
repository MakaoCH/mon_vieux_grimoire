const sharp = require('sharp');

const resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { buffer, originalname } = req.file;

    await sharp(buffer)
      .toFormat('webp', { quality: 20 })
      .toFile(`images/${originalname}.webp`);

    req.file.filename = `${originalname}.webp`;
    next();
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'enregistrement de l\'image convertie:', error);
    next(error);
  }
};

module.exports = resizeImage;


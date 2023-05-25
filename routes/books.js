// books.js (routes)
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBook);
router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);
router.get('/bestrating', booksCtrl.getBestRatingBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;

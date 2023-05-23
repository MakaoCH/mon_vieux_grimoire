const Book = require('../models/book');
const fs = require('fs');

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

//Créer un livre
exports.createBook = (req, res, next) => {
  const bookObject = req.body.book ? JSON.parse(req.body.book) : req.body;
  delete bookObject._id;
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !'}))
    .catch(error => res.status(400).json({ error }));
};

//Consulter un livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};


// modifier la publication du livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


//Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Book deleted !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//noter un livre
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;

// Créer un nouvel objet avec les propriétés attendues par le backend
  const ratingObj = {
    userId,
    grade: rating,
  };

  // Vérifier si l'utilisateur a déjà noté ce livre
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book) {
        // Vérifier si l'utilisateur a déjà noté ce livre
        const userRating = book.ratings.find(r => r.userId === userId);
        if (userRating) {
          // Mise à jour de la note existante
          userRating.grade = ratingObj.grade;
        } else {
          // Ajout d'une nouvelle note
          book.ratings.push(ratingObj);
        }

        // Calculer la nouvelle note moyenne
        const totalRating = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        // Sauvegarder les modifications du livre
        book.save()
        .then(book => res.status(200).json(book))
          .catch(error => res.status(400).json({ error }));
      } else {
        res.status(404).json({ error: 'Livre non trouvé' });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//Les mieux notés

exports.getBestRatingBook = (req, res, next) => {
  Book.find().sort({averageRating: -1}).limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
}; 



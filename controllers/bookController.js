const fs = require('fs');
const Book = require('../models/book');

exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books.map(book => ({
      ...book.toObject(),
      voteCount: book.ratings.length
    }))))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.status(200).json({ ...book.toObject(), voteCount: book.ratings.length });
    })
    .catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res) => {
  const bookObject = req.file ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` } : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id }).then(book => {
    if (book.userId != req.auth.userId) return res.status(401).json({ message: 'Not authorized' });
    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }).then(() => res.status(200).json({ message: 'Livre modifié !' })).catch(error => res.status(401).json({ error }));
  }).catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id }).then(book => {
    if (book.userId != req.auth.userId) return res.status(401).json({ message: 'Not authorized' });
    const filename = book.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Book.deleteOne({ _id: req.params.id }).then(() => res.status(200).json({ message: 'Livre supprimé !' })).catch(error => res.status(401).json({ error }));
    });
  }).catch(error => res.status(500).json({ error }));
};

exports.createRating = (req, res) => {
  const { userId, rating } = req.body;
  if (rating < 0 || rating > 5) return res.status(400).json({ error: 'Rating must be between 0 and 5' });

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ error: 'Book not found' });
      if (book.ratings.find(r => r.userId === userId)) return res.status(400).json({ error: 'User already rated this book' });

      book.ratings.push({ userId, grade: rating });
      const ratingSum = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = Number((ratingSum / book.ratings.length).toFixed(2));

      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => {
      if (books.length === 0) return res.status(200).json([{ message: 'No books yet' }]);
      res.status(200).json(books);
    })
    .catch(error => res.status(400).json({ error }));
};
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('../middleware/multerMiddleware');
const bookCtrl = require('../controllers/bookController');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.createRating);

module.exports = router;
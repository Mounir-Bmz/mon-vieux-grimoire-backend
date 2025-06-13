const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connexion à MongoDB réussie !')).catch(error => console.log('Connexion à MongoDB échouée ! Erreur :', error.message));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
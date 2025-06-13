const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connexion à MongoDB réussie !')).catch(error => console.log('Connexion à MongoDB échouée ! Erreur :', error.message));

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
const bookRoutes = require('./routes/bookRoutes'); 
const userRoutes = require('./routes/userRoutes');
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
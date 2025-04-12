const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const cookieParse = require('cookie-parser');
const db = require('./src/config/db')
const authController = require('./src/controllers/auth.controller');
app.use(cors({
    origin: ['http://localhost:5173','https://melodify-wine.vercel.app'], // Replace with your frontend URL
    credentials : true,
}));

app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: "Too many requests, please try again later."
  });
app.use(limiter);
app.use(cookieParse());

db.DatabaseConnection();

app.get('/', (req, res) => {
    res.send('Melodify Backend is running!');
});

app.post('/signup', authController.signup);
app.post('/login', authController.login) ;
app.get('/logout', authController.logout);
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

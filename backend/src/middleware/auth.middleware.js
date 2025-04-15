const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/user.model');

class AuthMiddleware {
  async authenticate(req, res, next) {
    const token = req.cookies.jwt_token;
    console.log("Token: ", token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);  // Use the instance method directly
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized USER' });
    }
  }
}

module.exports = new AuthMiddleware();

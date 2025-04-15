const jwt = require('jsonwebtoken');
dotenv = require('dotenv');
dotenv.config();

class JwtService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY;
    this.expirationTime = '24h'; // Token expiration time
  }

  generateToken(userId,username,email,nickname) {
    const payload = { id: userId ,username,email,nickname };
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expirationTime });
  }
}

module.exports = new JwtService();
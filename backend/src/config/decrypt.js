const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

class CookieDecryptor {
    constructor(password) {
        this.password = password;
        this.key = crypto.createHash('sha256').update(this.password).digest();
    }

    decrypt(encryptedCookies) {
        try {
            // Read the encrypted cookie data
            console.log('Encrypted cookie data:', encryptedCookies);
            const [ivHex, encryptedCookie] = encryptedCookies.split(':');
            const iv = Buffer.from(ivHex, 'hex');

            // Decrypt the cookie data
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
            let decrypted = decipher.update(encryptedCookie, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            // Save the decrypted cookie to a file
            const outputPath = path.join(__dirname, 'decrypted.txt');
            fs.writeFileSync(outputPath, decrypted);
            console.log('Decrypted cookie saved to:', outputPath);

            return decrypted;
        } catch (error) {
            console.error('Error decrypting cookies:', error);
            throw error;
        }
    }
}

module.exports = CookieDecryptor;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
class Database{
    async DatabaseConnection(){
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            console.log('MongoDB Connected');
            
        } catch (error) {
            console.error('MongoDB Connection Failed ', err);
            process.exit(1);
        }

    }
}
module.exports = new Database();
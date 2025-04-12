const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const JwtService = require("../utils/jwt");
const dotenv = require("dotenv");
dotenv.config();

class authController {

    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    static comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    async signup(req, res) {

        const { username, nickname, email, password } = req.body;
        if (!username || !nickname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = authController.hashPassword(password);
        const newUser = new User({
            username,
            nickname,
            email,
            passwordHash: hashedPassword,
        });

        await newUser.save();
        res.json({ message: "go to login user registered successfully" });
    };

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log(user);
        const isPasswordValid = authController.comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = JwtService.generateToken(user._id);
        
        res.cookie("jwt_token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7*24 * 60 * 60 * 1000, //7 days 
        })

        res.json({ message: "Login successfully" });
    };

    async logout(req, res) {
        res.clearCookie("jwt_token",
            {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict",
            path: "/"
        });
        res.json({ message: "Logout successfully" });
    };
}


module.exports = new authController();
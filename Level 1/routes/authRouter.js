const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel.js')
const crypto = require('crypto')

const router = express.Router();

let refreshTokens = [];

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered ' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).send("Invalid credentials!");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).send("Invalid credentials!");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie('refresh token', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({ accessToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
});

function generateAccessToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, "accesssecretkey", { expiresIn: '15m' });
}
function generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
}

module.exports = router;
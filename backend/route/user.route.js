const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../db/user.model');

const router = express.Router();
const saltRounds = 10;

router.post('/signup', async (req, res) => {

    const { name, username, password } = req.body;
    console.log(req.body)

    if (!name || !username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await UserModel.createUser({ name, username, password: hashedPassword });
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Username already exists." });
        }
        res.status(500).json({ error: "Error creating new user." });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)

    try {
        const user = await UserModel.findUserByUsername(username);
        if (!user) {
            console.log('User not found')
            return res.status(404).send("User not found.");
        }

        console.log('User found, proceeding with password verification');

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ message: "User logged in successfully.", username: user.username });
        } else {
            res.status(401).send("Invalid username or password.");
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send("Login error.");
    }
});

router.post('/signout', (req, res) => {
    res.clearCookie('token');
    res.send("User signed out successfully.");
});

router.get('/isLoggedIn', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.send({ isLoggedIn: true, userId: decoded.userId });
    } catch (error) {
        res.status(401).send({ isLoggedIn: false });
    }
});

router.get('/:username', async function (req, res) {
    const username = req.params.username;
    try {
        const userData = await UserModel.findUserByUsername(username);
        if (!userData) {
            res.status(404).send('User not found');
        }
        res.status(200).send({ name: user.name, username: user.username });
    } catch (error) {
        res.status(500).send('Server error');
    }
})

module.exports = router
const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../db/user.model');
const { PostModel } = require('../db/post.model');

const router = express.Router();
const saltRounds = 10;

router.post('/signup', async (req, res) => {

    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await UserModel.createUser({ name, username, password: hashedPassword });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true, secure: true });

        return res.status(201).json({
            message: "User created successfully!",
            name: user.name,
            username: user.username
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Username already exists." });
        }
        res.status(500).json({ error: "Error creating new user." });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

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
            res.status(200).json({ message: "User logged in successfully.", name: user.name, username: user.username });
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
    if (!req.user) {
        return res.status(401).json({ isLoggedIn: false });
    }
    res.json({ isLoggedIn: true, userId: req.user._id });
});

router.get('/:username', async function (req, res) {
    const username = req.params.username;
    try {
        const userData = await UserModel.findUserByUsername(username);
        if (!userData) {
            return res.status(404).send('User not found');
        }

        const posts = await PostModel.find({ user: userData._id }).sort({ timestamp: -1 });
        res.status(200).json({
            name: userData.name,
            username: userData.username,
            posts: posts,
            description: userData.description,
            joinedAt: userData.createdAt
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Server error');
    }
})

function ensureUserMatches(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.username !== req.params.username) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
}

router.put('/:username/description', ensureUserMatches, async (req, res) => {
    const { username } = req.params;
    const { description } = req.body;

    if (description === undefined) {
        return res.status(400).json({ error: 'Description is required.' });
    }

    try {
        const userData = await UserModel.findUserByUsername(username);
        if (!userData) {
            return res.status(404).json({ error: 'User not found.' });
        }

        userData.description = description;
        await userData.save();
        return res.status(200).json({
            message: 'Description updated successfully!',
            description: userData.description
        });
    } catch (error) {
        console.error('Error updating user description:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router
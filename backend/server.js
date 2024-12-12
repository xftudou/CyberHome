require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

const userRoutes = require('./route/user.route');
const postRoutes = require('./route/post.route');

const app = express();

const authMiddleware = require('./middlewares/authMiddleware');

const dbPassword = process.env.DB_PASSWORD;
const mongoDBEndpoint = `mongodb+srv://Alina:${dbPassword}@cyberhome.4q9cw.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=CyberHome`;
mongoose.connect(mongoDBEndpoint);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Starting server on port:${PORT}`);
});
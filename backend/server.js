const express = require('express');
const app = express();
const path = require('path');

// const postRouter = require('./routes/posts');
// app.use('/api/posts', postRouter);

app.use(express.static(path.join(__dirname, '../frontend/build')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(process.env.PORT || 8000, () => {
    console.log('Starting server');
});
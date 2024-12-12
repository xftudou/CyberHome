const express = require('express');
const router = express.Router();
const UserModel = require('../db/user.model');
const PostModel = require('../db/post.model');

function ensureUserMatches(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.username !== req.params.username) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
}

router.post('/:username/posts', ensureUserMatches, async (req, res) => {
    try {
        const { username } = req.params;
        const { content } = req.body;

        const userData = await UserModel.findUserByUsername(username);
        if (!userData) return res.status(404).json({ message: 'User not found.' });

        const newPost = await PostModel.createPost({ user: userData._id, content });
        return res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.findAllPosts();
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).send("Failed to fetch posts: " + error.message);
    }
});

router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostModel.findPostById(id);
        if (post) {
            res.status(200).send(post);
        } else {
            res.status(404).send("Post not found.");
        }
    } catch (error) {
        res.status(500).send("Failed to fetch post: " + error.message);
    }
});

router.put('/:username/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const updatedPost = await PostModel.updatePost(id, { content });
        if (updatedPost) {
            res.status(200).send(updatedPost);
        } else {
            res.status(404).send("Post not found.");
        }
    } catch (error) {
        res.status(500).send("Failed to update post: " + error.message);
    }
});

router.delete('/:username/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await PostModel.deletePost(id);
        if (deletedPost) {
            res.status(200).send("Post deleted successfully.");
        } else {
            res.status(404).send("Post not found.");
        }
    } catch (error) {
        res.status(500).send("Failed to delete post: " + error.message);
    }
});

module.exports = router;
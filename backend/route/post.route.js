const express = require('express');
const router = express.Router();
const PostModel = require('../db/post.model');

router.post('/', async (req, res) => {
    const { user, content } = req.body;
    if (!user || !content) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const newPost = await PostModel.createPost({ user, content });
        res.status(201).send(newPost);
    } catch (error) {
        res.status(500).send("Failed to create post: " + error.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.findAllPosts();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send("Failed to fetch posts: " + error.message);
    }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
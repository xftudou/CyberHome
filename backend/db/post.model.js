const mongoose = require('mongoose');
const { PostSchema } = require('./post.schema');

const PostModel = mongoose.model("Post", PostSchema);

function createPost(postData) {
    return PostModel.create(postData);
}

function findPostById(postId) {
    return PostModel.findById(postId).populate('user').exec();
}

function findAllPosts() {
    return PostModel.find().populate('user').sort({ timestamp: -1 }).exec();
}

function updatePost(postId, updateData) {
    return PostModel.findByIdAndUpdate(postId, updateData, { new: true }).exec();
}

function deletePost(postId) {
    return PostModel.findByIdAndDelete(postId).exec();
}

module.exports = {
    createPost,
    findPostById,
    findAllPosts,
    updatePost,
    deletePost,
};
const mongoose = require('mongoose');
const UserSchema = require('./user.schema');

const UserModel = mongoose.model('User', UserSchema);

function createUser(user) {
    console.log("Creating user:", user);
    return UserModel.create(user);
}

function findUserByName(name) {
    return UserModel.findOne({ name }).exec();
}

function findUserByUsername(username) {
    return UserModel.findOne({ username }).exec();
}

function findUserById(id) {
    return UserModel.findById(id);
}

module.exports = {
    UserModel,
    createUser,
    findUserByName,
    findUserByUsername,
    findUserById
};
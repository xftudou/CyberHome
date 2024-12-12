const mongoose = require('mongoose');
const UserSchema = require('./user.schema');

const User = mongoose.model('User', UserSchema);

function createUser(user) {
    console.log("Creating user:", user);
    return User.create(user);
}

function findUserByName(name) {
    return User.findOne({ name }).exec();
}

function findUserByUsername(username) {
    return User.findOne({ username }).exec();
}

function findUserById(id) {
    return User.findById(id);
}

module.exports = {
    User,
    createUser,
    findUserByName,
    findUserByUsername,
    findUserById
};
const { Schema } = require('mongoose');

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, { collection: 'users' });

module.exports = UserSchema;
const Schema = require('mongoose').Schema;

exports.PokemonSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    }
}, { collection: 'posts' });
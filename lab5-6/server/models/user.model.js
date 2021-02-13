const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordVersion: {
        type: String,
        required: true,
        default: 1,
    },
    compromised: {
        type: Boolean,
        default: false
    },
})

module.exports = UserModels = mongoose.model('User', User);
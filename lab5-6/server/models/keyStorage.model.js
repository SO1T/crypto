const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KeyStorageModel = Schema({
    _id: Schema.ObjectId,
    DEK: {
        type: String,
        required: true,
    }
})


module.exports = KeyStorage = mongoose.model('KeyStorage', KeyStorageModel);
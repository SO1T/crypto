const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = Schema({
    _id: Schema.ObjectId,
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    }
})

module.exports = UserDataModal = mongoose.model('UserModel', UserModel);
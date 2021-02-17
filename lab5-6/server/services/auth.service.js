const UserModels = require('../models/user.model');
const UserDataModels = require('../models/userData.model');
const HashService = require('./hash.service');
const fs = require('fs');

const AuthService = () => {
    const commonPasswords = fs.readFileSync('./utils/passwords.txt', 'utf8').split('\r\n');
    const hashService = HashService();
    const createUser = async (username, password) => {
        const exitingUser = await UserModels.findOne({ username })
        if (exitingUser) {
            throw new Error('User with provided username already exists')
        }
        const hashedPassword = await hashService.hash(password);
        const user = await UserModels.create({ username, password: hashedPassword });
        await UserDataModels.create({_id: user._id});
        return { id: user._id, username: user.username};
    }

    const validateUserCredentials = async (username, password) => {
        const user = await UserModels.findOne({ username: username })
        if (!user) {
            throw new Error('No user found with provided username')
        }

        const isPasswordCorrect = await hashService.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Password is wrong');
        }
        return {id: user._id, username: user.username};
    }

    const validatePassword = (password) => {
        if (password.length < 8) {
            throw new Error('Min password length is 8!')
        }
        if (commonPasswords.includes(password)) {
            throw new Error('Password is too weak!')
        }
    }
    return {
        createUser, validateUserCredentials, validatePassword
    }
}

module.exports = AuthService;
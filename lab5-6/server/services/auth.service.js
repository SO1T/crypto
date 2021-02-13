const { UserAlreadyExistsError, WrongCredentialsError, ValidationError } = require('./auth.errors');

class AuthService {
    constructor(userModel, hashService, userDataModel, commonPasswords) {
        this.userModel = userModel;
        this.hashService = hashService;
        this.userDataModel = userDataModel;
        this.commonPasswords = commonPasswords
    }

    async createUser(username, password) {
        const exitingUser = await this.userModel.findOne({ username })
        if (exitingUser) {
            throw new UserAlreadyExistsError('User with provided username already exists')
        }
        const hashedPassword = await this.hashService.hash(password);
        const user = await this.userModel.create({ username, password: hashedPassword });
        await this.userDataModel.create({_id: user._id});
        return { id: user._id, username: user.username};
    }

    async validateUserCredentials(username, password) {
        const user = await this.userModel.findOne({ username: username })
        if (!user) {
            throw new WrongCredentialsError('No user found with provided username')
        }

        const isPasswordCorrect = await this.hashService.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new WrongCredentialsError('Password is wrong');
        }
        return {id: user._id, username: user.username};
    }

    validatePassword(password) {
        if (password.length < 8) {
            throw new ValidationError('Min password length is 8!')
        }
        if (this.commonPasswords.includes(password)) {
            throw new ValidationError('Password is too weak!')
        }
    }
}

module.exports = AuthService;
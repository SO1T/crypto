class UserDataService {
    constructor(userDataModel, dataEncryptionService) {
        this.userDataModel = userDataModel;
        this.dataEncryptionService = dataEncryptionService;
    }

    async getUserData(userId) {
        const {email, phone, address} = await this.userDataModel.find({ _id: userId });
        return this.dataEncryptionService.decrypt(userId, {email, phone, address});
    }

    async updateUserData(userId, data) {
        console.log(userId, data)
        const encryptedData = await this.dataEncryptionService.encrypt(userId, data);
        console.log(2)
        await this.userDataModel.update({ _id: userId }, encryptedData);
    };
}

module.exports = UserDataService;
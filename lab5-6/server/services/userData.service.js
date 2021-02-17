const DataEncryptionService = require('./dataEncryption.service');
const UserDataModal = require('../models/userData.model');

const UserDataService = () => {
    const encServ = DataEncryptionService();
    const getUserData = async (userId) => {
        const {email, phone, address} = await UserDataModal.findOne({ _id: userId });
        return encServ.decrypt(userId, {email, phone, address});
    }
    const updateUserData = async (userId, data) => {
        console.log(345)
        const encryptedData = await encServ.encrypt(userId, data);
        console.log(66,encryptedData)
        await UserDataModal.findByIdAndUpdate({ _id: userId }, encryptedData);
    }
    return {
        getUserData, updateUserData
    }
}
module.exports = UserDataService;
const aws = require('aws-sdk');
const KEY_SPEC = 'AES_256';
const {decrypt, encrypt} = require('./../utils/aes256gcm')

class DataEncryptionService {
    constructor(keyStorageModel) {
        this.keyStorageModel = keyStorageModel;
        this.kmsClient = new aws.KMS({
            region: 'us-east-1'
        });
        this.encrypt = this.encrypt.bind(this)
        this.decrypt = this.decrypt.bind(this)
    }

    async encrypt(userId, data) {
        console.log(6)
        const [encryptedKey, key] = await this.createDEK();
        console.log(7)
        const encryptedData = encrypt(data, key);
        const existingKey = await this.keyStorageModel.find({ _id: userId});
        if (existingKey) {
            await this.keyStorageModel.update(userId, {DEK: encryptedKey.toString('hex')});
        } else {
            await this.keyStorageModel.create({DEK: encryptedKey.toString('hex'), _id: userId});
        }

        return encryptedData;
    }

    async decrypt(userId, encryptedData) {
        const keyData = await this.keyStorageModel.find({ _id: userId});
        if(!keyData) {
            return encryptedData
        }
        const decryptedKey = await this.decryptDEK(keyData.DEK);
        return decrypt(encryptedData, decryptedKey);
    }

    createDEK() {
        return new Promise((resolve, reject) => {
            this.kmsClient.generateDataKey({KeyId: process.env.KEY_ID, KeySpec: KEY_SPEC}, (err, data) => {
                if(err) {
                    console.log(45,err)
                    return reject(err);
                }
                const { CiphertextBlob, Plaintext } = data;
                resolve([CiphertextBlob, Plaintext]);
            })
        })
    }

    decryptDEK(key) {
        return new Promise((resolve, reject) => {
            this.kmsClient.decrypt({CiphertextBlob: new Buffer(key, 'hex'), KeyId: process.env.KEY_ID}, (err, data) => {
                if (err) {
                    return reject(err);
                }

                const {Plaintext} = data;
                resolve(Plaintext);
            })
        })
    }
}

module.exports = DataEncryptionService;

// keyid AKIAQ26KDU5NB2S2G664
// acceskey yZjd5JcoTclAm1Z9UuMoVeghEyc+UdoRFvjGWDhR


// AKIAQ26KDU5NOGKQYZN5
// 5366bIlDqorRQemIQWJ3YlwwDyyqeP2HbNvelUug
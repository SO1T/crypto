const aws = require('aws-sdk');
const KEY_SPEC = 'AES_256';
const KeyStorageModel = require('../models/keyStorage.model')
const ALGORITHM = 'aes-256-gcm';
const crypto = require('crypto');

const DataEncryptionService = () => {
    const kmsClient = new aws.KMS({ region: 'us-east-1'});
    const encrypt = async (userId, data) => {
        const [encryptedKey, key] = await createDEK();
        const result = {};
        Object.keys(data).forEach((field) => {
            const nonce = new Buffer(crypto.randomBytes(16), 'utf8');
            const cipher = crypto.createCipheriv(ALGORITHM, key, nonce);
            let encryptedData = cipher.update(data[field], 'utf8', 'hex');
            encryptedData += cipher.final('hex');
            result[field] = `${encryptedData}.${nonce.toString('hex')}.${cipher.getAuthTag().toString('hex')}`
        })
        const encryptedData = result;
        const existingKey = await KeyStorageModel.findOne({_id: userId});
        if (existingKey) {
            await KeyStorageModel.findOneAndUpdate({ _id: userId}, {DEK: encryptedKey.toString('hex')}, {upsert: true});
        } else {
            await KeyStorageModel.create({DEK: encryptedKey.toString('hex'), _id: userId});
        }
        return encryptedData;
    }

    const decrypt = async (userId, encryptedData) => {
        const keyData = await KeyStorageModel.findOne({ _id: userId});
        if(!keyData) {
            return encryptedData
        }
        const decryptedKey = await decryptDEK(keyData.DEK);
        const result = {};

        Object.keys(encryptedData).forEach((field) => {
            const [data, nonce, authTag] = encryptedData[field].split('.');
            if(!nonce && !authTag) {
                return result[field] = '';
            }
            const decipher = crypto.createDecipheriv(ALGORITHM, decryptedKey, Buffer.from(nonce, 'hex'));
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));
            let decryptedData = decipher.update(data, 'hex', 'utf8');
            decryptedData += decipher.final('utf8');
            result[field] = decryptedData;
        })
        return result;
    }

    const createDEK = () => {
        return new Promise((resolve, reject) => {
            kmsClient.generateDataKey({KeyId: process.env.KEY_ID, KeySpec: KEY_SPEC}, (err, data) => {
                if(err) {
                    return reject(err);
                }
                const { CiphertextBlob, Plaintext } = data;
                resolve([CiphertextBlob, Plaintext]);
            })
        })
    }

    const decryptDEK = (key) => {
        return new Promise((resolve, reject) => {
            kmsClient.decrypt({CiphertextBlob: new Buffer(key, 'hex'), KeyId: process.env.KEY_ID}, (err, data) => {
                if (err) {
                    return reject(err);
                }

                const {Plaintext} = data;
                resolve(Plaintext);
            })
        })
    }
    return {
        encrypt, decrypt
    }
}

module.exports = DataEncryptionService;

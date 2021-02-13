const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const encrypt = (data, key) => {
    const result = {};
    Object.keys(data).forEach((field) => {
        const nonce = new Buffer(crypto.randomBytes(16), 'utf8');
        const cipher = crypto.createCipheriv(ALGORITHM, key, nonce);
        let encryptedData = cipher.update(data[field], 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        result[field] = `${encryptedData}.${nonce.toString('hex')}.${cipher.getAuthTag().toString('hex')}`
    })
    return result;
};

const decrypt = (encryptedData, key) => {
    const result = {};
    Object.keys(encryptedData).forEach((field) => {
        const [data, nonce, authTag] = encryptedData[field].split('.');
        if(!nonce && !authTag) {
            return result[field] = '';
        }
        const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(nonce, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decryptedData = decipher.update(data, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        result[field] = decryptedData;
    })

    return result;
};

module.exports = {
    encrypt,
    decrypt
}
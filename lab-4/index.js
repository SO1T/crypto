const generate = require('./gen');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const HASH = {
    SHA1_WITH_SALT: (data) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const sha1sum = crypto.createHash('sha1');
        sha1sum.update(data + salt);
        return `${sha1sum.digest('hex')},${salt}`
    },
    MD5: (data) => {
        const md5sum = crypto.createHash('md5');
        md5sum.update(data);
        return md5sum.digest('hex');
    },
    BCR: (data) => {
        return bcrypt.hashSync(data, 16)
    },
}

const getHash = () => {
    Object.keys(HASH).forEach(hash => {
        const f = hash + '.csv';
        const pass = generate();
        const data = pass.map(p => HASH[hash](p));
        const res = data.join('\r\n');
        fs.writeFile(path.join(__dirname, 'hash' ,f), res, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                console.error(err);
            }
        });
    })
}

getHash();

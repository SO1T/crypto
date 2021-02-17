const argon2 = require('argon2');
const { SHA3 } = require('sha3');

const HashService = () => ({
    compare: async (text, hashedText) => {
        const digest = new SHA3(512).update(text).digest('hex')
        try {
            return await argon2.verify(hashedText, digest)
        } catch (e) {
            return false
        }
    },
    hash: async (text) => {
        const sha2Digest = new SHA3(512).update(text).digest('hex')
        return argon2.hash(sha2Digest);
    }
})

module.exports = HashService;
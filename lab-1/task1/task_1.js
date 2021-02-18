const { ALPHABET, FREQ } = require('../helper')

const decode = (text, key) => text.split('').map(char => xorFromCharCode(char, key)).join('');

const xor = (char, key) => char.charCodeAt(0) ^ key;

const xorFromCharCode = (char, key) => String.fromCharCode(xor(char, key));

const KEY_LENGTH = 256;

const getKey = (text) => [...new Array(KEY_LENGTH - 1)].map((_, key) => {
    const str = decode(text, key + 1);
    const result = ALPHABET.reduce((sum, curr ) => {
        const frequency = str.split('').filter(char => char === curr).length / str.length;
        return sum + Math.abs(frequency - FREQ[curr])
    }, 0)
    return { key: key + 1, result };
}).sort((a, b) => a.result - b.result)[0].key;


module.exports = {
    getKey, xorFromCharCode, decode
}

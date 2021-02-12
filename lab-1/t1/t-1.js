const { ALPHABET, FRQ } = require('../helpers');

const decode = (text, key) => text.split('').map(c => xorChar(c, key)).join('');

const xor = (char, key) => char.charCodeAt(0) ^ key;

const xorChar = (char, key) => String.fromCharCode(xor(char, key));

const singleByteKey = (text) => [...new Array(255)].map((_, i) => {
    const decoded = decode(text, i + 1);
    const res = ALPHABET.reduce((sum, curr ) => {
        const frequency = decoded.split('').filter(char => char === curr).length / decoded.length;
        return sum + Math.abs(frequency - FRQ[curr])
    }, 0)
    return { key: i + 1, res };
}).sort((a, b) => a.res - b.res)[0].key;

module.exports = {
    singleByteKey, xorChar, decode
}

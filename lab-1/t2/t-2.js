const { singleByteKey, xorChar } = require('../t1/t-1');

const shiftText = (text, shift) => {
    const end = text.substring(0, text.length - shift);
    const start = text.substring(text.length - shift, text.length)
    return start + end;
}

const coincidence = (text, shift) => {
    const shiftedText = shiftText(text, shift);
    const coincidenceCount = shiftedText.split('').reduce((result, current, index) => {
        return current === text[index] ? result + 1 : result
    }, 0)
    return coincidenceCount / text.length;
}

const decode = (text, key) => text.split('').map((char, index) => xorChar(char, key[index % key.length].charCodeAt(0))).join('');

const getShiftedSubstring = (text, shift, length) => {
    let str = '';
    let shift_index = shift;
    let count = 1;
    while (shift_index < text.length) {
        str += text[shift_index];
        shift_index = shift + length * count;
        count++;
    }
    return str;
}

const keyLength = (text) => {
    const indexesOfCoincidence = [...new Array(text.length - 1)]
        .map((_, shift) => coincidence(text, shift + 1));
    const sum = indexesOfCoincidence.reduce((sum, curr) => sum + curr)
    return indexesOfCoincidence.findIndex((index) => index > sum / indexesOfCoincidence.length) + 1
}

const repeating = (text) => {
    const key_length = keyLength(text);
    return [...new Array(key_length)].map((_, i) => {
        const str = getShiftedSubstring(text, i, key_length);
        const key_code = singleByteKey(str);
        return String.fromCharCode(key_code);
    }).join('')
}

const hexToString = (hex) => {
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }  return str;
}

module.exports = {
    coincidence,
    keyLength,
    repeating,
    hexToString,
    decode
}

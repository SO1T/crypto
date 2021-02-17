const fs = require('fs');
const path = require('path');
const PASSWORDS_AMOUNT = 100_000;
const commonPasswords = fs.readFileSync(path.join(__dirname, 'data', 'common-passwords.txt'), 'utf8').split('\r\n');
const mostCommonPasswords = fs.readFileSync(path.join(__dirname, 'data', 'top-100-passwords.txt'), 'utf8').split('\r\n');
const commonWords = fs.readFileSync(path.join(__dirname, 'data', 'common-words.txt'), 'utf8').split('\r\n');

const SYMB = '!@#$%^&*()_+-=';
const COMMON_REPLACEMENT = {
    'l': 1,
    'i': '!',
    'o': 0,
    's': 5,
    5: 's',
    1: 'l',
    0: '0'
}

const getInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandPass = (pass) => () => {
        const i = getInRange(0, pass.length - 1);
        return pass[i];
}

const genRandPass = () => {
    const length = getInRange(5, 16);
    return new Array(length).fill(0).map(() => String.fromCharCode(getInRange(32, 126))).join('');
}

const generateHumanLikePassword = () => {
    let pass = commonWords[getInRange(0, commonWords.length - 1)];
    if (pass.length < 5) {
        pass += commonWords[getInRange(0, commonWords.length - 1)];
    }

    if (Math.random() > 0.75) {
        const y = getInRange(1970, 2020);
        pass = Math.random() > .5 ? y + pass : pass + y;
    }

    if (Math.random() > 0.3 && pass.length < 8) {
        const length = getInRange(1, 4);
        const num = new Array(length).fill(0).map(() => getInRange(0, 9)).join('');
        pass = Math.random() > .5 ? num + pass : pass + num;
    }

    if (Math.random() > 0.4) {
        const i = getInRange(0, 3);
        const replace = Object.keys(COMMON_REPLACEMENT)[i];
        const regExp = new RegExp(replace, 'gi');
        pass = pass.replace(regExp, COMMON_REPLACEMENT[replace]);
    }

    if (Math.random() > 0.6) {
        const i = getInRange(0, SYMB.length - 1);
        pass = Math.random() > .5 ? pass + SYMB[i] : SYMB[i] + pass;
    }

    if (Math.random() > 0.5) {
        const length = getInRange(1 ,4);
        new Array(length).fill(0).forEach(() => {
            const index = getInRange(0, pass.length - 1);
            const letter = pass[index].toUpperCase();
            const stringArray = pass.split('');
            stringArray.splice(index, 1, letter);
            pass =  stringArray.join('')
        })
    }

    return pass;
}

const createAndFillArr = (size, fn) => {
    return new Array(size).fill(0).map(fn)
}

const generate = () => {
    let pass = [];

    const mcpl = getInRange(PASSWORDS_AMOUNT * 0.05, PASSWORDS_AMOUNT * 0.1);
    pass = [...pass, createAndFillArr(mcpl, getRandPass(mostCommonPasswords))];

    const cpl = getInRange(PASSWORDS_AMOUNT * 0.5, PASSWORDS_AMOUNT * 0.9);
    pass = [...pass, createAndFillArr(cpl, getRandPass(commonPasswords))];

    const rpl = getInRange(0.01 * PASSWORDS_AMOUNT, 0.05 * PASSWORDS_AMOUNT);
    pass = [...pass, createAndFillArr(Math.min(rpl, PASSWORDS_AMOUNT - pass.flat().length), genRandPass)];

    const hlpl = PASSWORDS_AMOUNT - pass.flat().length;
    pass = [...pass, createAndFillArr(hlpl, generateHumanLikePassword)]

    return pass.flat().sort(() => Math.random() > 0.5 ? -1 : 1);
}

module.exports = generate;
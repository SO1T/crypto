const {createAccount, makeBet} = require('./api');

const MILLION = 1_000_000;
const M = 2 ** 32;

const abs = (value) => value >= 0 ? value : -value;

const posMod = (a, b) => a < 0 ? b - abs(a) % b : a % b;

const calculateNextValue = (a, number, c) => {
    const result = (a * number + c) % M;
    const isOutOfRange = Math.abs(result) > 2 ** 31;
    if (!isOutOfRange) return result;
    return result > 0 ? result - M : result + M;
}

const extendedGcd = (a, b) => {
    let [oldR, r] = [a, b];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];

    while (r !== 0) {
        const quotient = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
        [oldT, t] = [t, oldT - quotient * t];
    }
    return oldS
}

const params = async (id) => {
    const numbers = [];
    let multiplier;
    for(let i = 0; i < 3; i++) {
        const response = await makeBet('Lcg', id, 1, 0);
        numbers.push(response.realNumber);
    }

    const s = extendedGcd(numbers[1] - numbers[0], M);
    const mod = posMod(s, M);
    const diff = BigInt((numbers[2] - numbers[1]));
    multiplier = Number(posMod(diff * BigInt(mod), BigInt(M)));

    const c = posMod(numbers[1] - numbers[0] * multiplier, M)

    return [multiplier, c, numbers[numbers.length - 1]];
}

const mine = async () => {
    const account = await createAccount();

    const [a, c, lastNum] = await params(account.id);
    let money = 1;
    let number = lastNum;
    let bet = null;

    do {
        number = calculateNextValue(a, number, c);
        bet = await makeBet('Lcg', account.id, money, number);
        money = bet.account.money;
    } while (money < MILLION)

    console.log('bet', bet)
    console.log('Current money: ', money)
}

mine();
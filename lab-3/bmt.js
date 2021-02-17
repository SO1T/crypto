const {createAccount, makeBet} = require('./api');
const MersenneTwister = require('mersenne-twister');

const MILLION = 1_000_000;
const MERSENNE_TWISTER_STATES_COUNT = 624;
const BIT_SIZE = 32;

const rightXor = (value,shift) => {
    let result = 0;
    for (let i = 0; i < BIT_SIZE; i++) {
        result = value ^ result >>> shift
    }
    return result;
}

const leftXor = (value, shift, mask) => {
    let result = 0;
    for (let i = 0; i < BIT_SIZE; i++) {
        result = (result << shift & mask) ^ value
    }
    return result;
}

const invert = (value) => {
    let untemperedValue = value;
    untemperedValue = rightXor(untemperedValue, 18);
    untemperedValue = leftXor(untemperedValue, 15, 0xefc60000);
    untemperedValue = leftXor(untemperedValue, 7, 0x9d2c5680);
    untemperedValue = rightXor(untemperedValue, 11);
    return untemperedValue
}

const createHackedGenerator = function* (states) {
    const hackedStates = states.map(invert)
    const generator = new MersenneTwister();
    generator.mt = hackedStates;
    while (true) {
        yield generator.random_int();
    }
}

const mine = async () => {
    const account = await createAccount();
    const numbers = [];
    for (let i = 0; i < MERSENNE_TWISTER_STATES_COUNT; i++) {
        const response = await makeBet('BetterMt', account.id, 1, 0);
        numbers.push(response.realNumber)
        console.log('bet:', i);
    }
    const generator = createHackedGenerator(numbers);

    let money = 325;
    let bet = null;

    do {
        const number = generator.next().value;
        bet = await makeBet('BetterMt', account.id, money, number);
        money = bet.account.money;
    } while (money < MILLION)

    console.log(bet);
    console.log('Current money: ', money)
}

mine();

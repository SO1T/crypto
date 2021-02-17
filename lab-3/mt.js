const {createAccount, makeBet} = require('./api');
const MersenneTwister = require('mersenne-twister');

const MILLION = 1_000_000;

const mine = async () => {
    const timeBeforeCreating = (new Date()).getTime() / 1000;
    const account = await createAccount();
    const timeAfterCreating = (new Date()).getTime() / 1000;

    const response = await makeBet('Mt', account.id, 1, 0);

    let seed = timeBeforeCreating;
    let newGeneratedValue = null;
    let generator = null;

    do {
        generator = new MersenneTwister(seed);
        newGeneratedValue = generator.random_int();
        seed++;
    } while (newGeneratedValue !== response.realNumber && seed < timeAfterCreating + 1)

    let money = 1;
    let bet = null;

    do {
        bet = await makeBet('Mt', account.id, money, generator.random_int());
        money = bet.account.money;
    } while (money < MILLION)

    console.log(bet);
    console.log('money: ', money)
}

mine();

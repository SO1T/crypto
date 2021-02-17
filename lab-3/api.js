const http = require('http');
const url = require('url');
const HOST = '95.217.177.249';
const uuid = require('uuid');

const ID = uuid.v4();

const request = (path, queryParams) => {
    return new Promise((resolve, reject) => {
        const queryString = '?' + new url.URLSearchParams(queryParams).toString()
        const options = {
            host: HOST,
            path: path + queryString
        }

        http.request(options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(data));
            });

            response.on('error', reject)
        }).end();
    })
}

const createAccount = () => {
    const queryParams = {
        id: ID
    }
    return request('/casino/createacc', queryParams);
}

const makeBet = (mode, accountId, bet, number) => {
    const betPath = `/casino/play${mode}`;
    const queryParams = {
        id: accountId,
        bet,
        number
    }
    return request(betPath, queryParams)
}

module.exports = {
    createAccount, makeBet
}
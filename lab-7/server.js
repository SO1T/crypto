const https = require('https');
const fs = require('fs');
const express = require('express')

const options = {
    cert: fs.readFileSync('./certs/crt.pem'),
    key: fs.readFileSync('./certs/key.pem')
};

const app = express();

https.createServer(options, app).listen(8000);
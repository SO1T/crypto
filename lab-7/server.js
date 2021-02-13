const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('./certs/crt.pem'),
    key: fs.readFileSync('./certs/key.pem')
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000);
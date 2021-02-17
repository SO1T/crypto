const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env')})
const mongoose = require('mongoose');

const AuthService = require('./services/auth.service');
const HashService = require('./services/hash.service');
const AuthController = require("./controllers/auth.controller");
const UserModels = require('./models/user.model');
const UserDataModal = require('./models/userData.model');
const DataEncryptionService = require('./services/dataEncryption.service');
const UserDataService = require('./services/userData.service');
const UserDataController = require('./controllers/userData.controller');
const KeyStorage = require('./models/keyStorage.model')

// Connect to Mongo
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to mongo'))
    .catch((err) => console.log(err));

const app = express()
const PORT = 8080;

app.use(cors())
app.use(express.json())

const authService = AuthService();
const dataEncryptionService = DataEncryptionService(KeyStorage);
const userDataService = UserDataService(UserDataModal, dataEncryptionService);

const authController = AuthController(authService);
const userDataController = UserDataController(userDataService, authService);

app.post('/login', authController.login);
app.post('/register', authController.register);
app.put('/user', userDataController.updateData);
app.post('/user', userDataController.getData);

app.listen(PORT, () => console.log('Server has been started on port: ', PORT))
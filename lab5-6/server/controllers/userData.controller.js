class UserDataController {
    constructor(userDataService, authService) {
        this.userDataService = userDataService;
        this.authService = authService;
        this.getData = this.getData.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    async getData(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
            const user = await this.authService.validateUserCredentials(username, password);
            const data = await this.userDataService.getUserData(user.id);
            res.status(200).json({ data })
        } catch (e) {
            if (e.name === 'WrongCredentialsError') {
                return res.status(401).end('Wrong credentials')
            }
            res.status(500).end()
        }
    }
    async updateData(req, res) {
        const { username, password, data } = req.body;

        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
            const user = await this.authService.validateUserCredentials(username, password);
            console.log(1)
            await this.userDataService.updateUserData(user.id, data);
            console.log(2)
            res.status(200).json({ message: 'Data successfully updated' })
        } catch (e) {
            if (e.name === 'WrongCredentialsError') {
                return res.status(401).end('Wrong credentials')
            }
            res.status(500).end()
        }
    }
}

module.exports = UserDataController;
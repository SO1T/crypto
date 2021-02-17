const AuthController = (authService) => ({
    login: async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
           const user = await authService.validateUserCredentials(username, password);
           res.status(200).json({ message: 'Successful login!', data: user })
        } catch (e) {
            if (e.name === 'WrongCredentialsError') {
                return res.status(401).end('Wrong credentials')
            }
            res.status(500).end()
        }
    },
    register: async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
            authService.validatePassword(password);
            const user = await authService.createUser(username, password);
            res.status(201).json({ message: 'New user created!', data: user })
        } catch (e) {
            if (e.name === 'ValidationError') {
                return res.status(400).end(e.message)
            }
            if (e.name === 'UserAlreadyExistsError') {
                return res.status(409).end(e.message)
            }

            res.status(500).end()
        }
    }
})

module.exports = AuthController;
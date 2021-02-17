const UserDataController = (userDataService, authService) => {
    const getData = async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
            const user = await authService.validateUserCredentials(username, password);
            const data = await userDataService.getUserData(user.id);
            res.status(200).json({ data })
        } catch (e) {
            if (e.name === 'WrongCredentialsError') {
                return res.status(401).end('Wrong credentials')
            }
            res.status(500).end()
        }
    }
    const updateData = async (req, res) => {
        const { username, password, data } = req.body;
        console.log(data)
        if (!username || !password) {
            return res.status(400).end('username and password are required!')
        }

        try {
            const user = await authService.validateUserCredentials(username, password);
            await userDataService.updateUserData(user.id, data);
            res.status(200).json({ message: 'Data successfully updated' })
        } catch (e) {
            if (e.name === 'WrongCredentialsError') {
                return res.status(401).end('Wrong credentials')
            }
            res.status(500).end()
        }
    }
    return {
        getData, updateData
    }
}

module.exports = UserDataController;
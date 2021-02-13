class ValidationError extends Error {
    name = 'ValidationError'
}
class WrongCredentialsError extends Error {
    name = 'WrongCredentialsError'
}
class UserAlreadyExistsError extends Error {
    name = 'UserAlreadyExistsError'
}

module.exports = {
    ValidationError,
    WrongCredentialsError,
    UserAlreadyExistsError
}
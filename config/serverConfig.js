const configServer = {
    dev: {
        'PORT': 5000,
        SALT_ROUNDS: 5,
        SECRET: 'npm'
    },
    prod: {
        'PORT': 80,
        SALT_ROUNDS: 5,
        SECRET: 'npm'
    }
}

module.exports = configServer[process.env.NODE_ENV];
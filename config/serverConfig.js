const configServer = {
    dev: {
        'PORT': 5000
    },
    prod: {
        'PORT': 80
    }
}

module.exports = configServer[process.env.NODE_ENV];
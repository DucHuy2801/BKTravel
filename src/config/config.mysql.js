'use strict'

const dev = {
    app: {
        port: process.env.DB_PORT || 5000,
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
}

const config = {dev}
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
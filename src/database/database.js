const { Pool } = require('pg');
const dotenv  = require('dotenv');
const Connection = require('./connection');

class Database {

    constructor() {
        const config = dotenv.config().parsed;
        this.pool = new Pool({
                        user: config.DB_USER,
                        host: config.DB_URL,
                        database: config.DB_NAME,
                        password: config.DB_PASSWORD,
                        port: config.DB_PORT
                    });
    }

    async getConnection() {
        const client = await this.pool.connect();
        return new Connection(client);
    }

}

module.exports = new Database();
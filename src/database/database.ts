import { Pool } from 'pg';
import dotenv from 'dotenv';
import { Connection } from './connection';

export class Database {
    
    private pool: Pool;

    constructor() {
        const config = {...dotenv.config().parsed};
        this.pool = new Pool({
                        user: config.DB_USER,
                        host: config.DB_URL,
                        database: config.DB_NAME,
                        password: config.DB_PASSWORD,
                        port: parseInt(config.DB_PORT)
                    });
    }

    async getConnection() : Promise<Connection> {
        const client = await this.pool.connect();
        return new Connection(client);
    }

    async query(sql:string, binds=[]) {
        const client = await this.getConnection();
        let res = null;
        try {
            res = await client.query(sql, binds);
        } finally {
            client.release();
        }
        return res
    }

}

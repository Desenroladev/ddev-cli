import { PoolClient } from "pg";

export class Connection {

    constructor(private client: PoolClient) {
    }

    async start() {
        await this.client.query('BEGIN');
    }

    async commit(): Promise<void> {
        await this.client.query('COMMIT');
        this.release();
    }

    async rollback() {
        await this.client.query('ROLLBACK');
        this.release();
    }

    async query(sql:string, binds=[]) : Promise<any> {
        const res = await this.client.query(sql, binds);
        return res.rows
    }

    async release() {
        await this.client.release();
    }

}

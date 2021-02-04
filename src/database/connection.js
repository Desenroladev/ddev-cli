
class Connection {

    constructor(client) {
        this.client = client;
    }

    async start() {
        await this.client.query('BEGIN');
    }

    async commit() {
        await this.client.query('COMMIT');
        await this.client.release();
    }

    async rollback() {
        await this.client.query('ROLLBACK');
        await this.client.release();
    }

    async query(sql, binds=[]) {
        const res = await this.client.query(sql, binds);
        return res.rows
    }

}

module.exports = Connection;
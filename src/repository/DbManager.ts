import {ConnectionManager} from 'typeorm';
import {DBConfig} from '../config/DBConfig';

export class DbManager {
    private static instance: DbManager = null;
    private connectionManager: ConnectionManager;

    constructor() {
            this.connectionManager = new ConnectionManager();
            this.connectionManager.create(DBConfig.options).connect();
    }

    public static async getInstance() {
        if (DbManager.instance === null) {
            DbManager.instance = new DbManager();
        }

        return DbManager.instance;
    }

    public async getConnection() {
        let connection = this.connectionManager.get();
        if (connection.isConnected === false ) {
            connection = await connection.connect();
        }
        return connection;
    }

    public async createQueryBuilder(entity) {
        const connection  = await this.getConnection();
        const repository  = connection.getRepository(entity);
        return repository.createQueryBuilder();
    }
}

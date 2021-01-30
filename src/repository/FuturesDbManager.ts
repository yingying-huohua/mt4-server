import {ConnectionManager} from 'typeorm';
import {DBConfig} from '../config/DBConfig';

export class FuturesDbManager {
    private static instance: FuturesDbManager = null;
    private connectionManager: ConnectionManager;

    constructor() {
            this.connectionManager = new ConnectionManager();
            this.connectionManager.create(DBConfig.futuresOptions).connect();
    }

    public static async getInstance() {
        if (FuturesDbManager.instance === null) {
            FuturesDbManager.instance = new FuturesDbManager();
        }

        return FuturesDbManager.instance;
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

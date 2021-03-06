import {ValidatorUtils} from '../../utils/ValidatorUtils';
import {FuturesDbManager} from '../FuturesDbManager';
import {Instrument} from '../../entity/futures/Instrument';

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class InstrumentRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): InstrumentRepository {
        if (InstrumentRepository.repository == null) {
            InstrumentRepository.repository = new InstrumentRepository();
        }
        return InstrumentRepository.repository;
    }

    /**
     * 根据品种id获取合约(一个品种可以在多个合约中)
     */
    async listInstrumentIds(productId) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Instrument)
            .createQueryBuilder()
            .select('instrument_id');

        if (ValidatorUtils.isNotEmpty(productId)) {
            queryBuilder.andWhere('product_id = :productId', {productId: productId});
        }
        const result = await queryBuilder.getRawMany();
        return result;
    }

    /**
     * 根据品种id获取合约(一个品种可以在多个合约中)
     */
    async listInstrument(productId) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Instrument)
            .createQueryBuilder()
            .select('instrument_id')
            .addSelect('instrument_name');

        if (ValidatorUtils.isNotEmpty(productId)) {
            queryBuilder.andWhere('product_id = :productId', {productId: productId});
        }
        const result = await queryBuilder.getRawMany();
        return {
            result: result
        }
    }

    /**
     * 根据合约id获取品种id
     */
    async listProductId(instrumentId) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Instrument)
            .createQueryBuilder()
            .select('product_id');

        if (ValidatorUtils.isNotEmpty(instrumentId)) {
            queryBuilder.andWhere('instrument_id = :instrumentId', {instrumentId: instrumentId});
        }
        const result = await queryBuilder.getRawMany();
        return {
            result: result
        }
    }
}

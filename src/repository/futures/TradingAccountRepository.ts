import {ValidatorUtils} from '../../utils/ValidatorUtils';
import {PageNoAndPageSizeUtils} from '../../utils/PageNoAndPageSizeUtils';
import {FuturesDbManager} from '../FuturesDbManager';
import {TradingAccount} from '../../entity/futures/TradingAccount';

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class TradingAccountRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): TradingAccountRepository {
        if (TradingAccountRepository.repository == null) {
            TradingAccountRepository.repository = new TradingAccountRepository();
        }
        return TradingAccountRepository.repository;
    }

    /**
     * 用户列表
     */
    async listAll() {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('account_id');
        const countBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('count(1)', 'count');
        queryBuilder.addOrderBy("account_id", "ASC");

        const result = await queryBuilder.getRawMany();
        return {
            result: result
        }
    }

    /**
     * 用户列表
     */
    async listAccount(pageNo, pageSize?) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('account_id');
        const countBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('count(1)', 'count');
        queryBuilder.addOrderBy("account_id", "ASC");

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            count: Number(count),
            result: result
        }
    }


    /**
     * 用户资金列表
     */
    async listTradingAccount(accountIds, openStart, openEnd, sortName, direction, pageNo, pageSize?) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('*');
        const countBuilder = connection
            .getRepository(TradingAccount)
            .createQueryBuilder()
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(accountIds)) {
            queryBuilder.andWhere('account_id in (:accountIds)', {accountIds: accountIds});
            countBuilder.andWhere('account_id in (:accountIds)', {accountIds: accountIds});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('create_time >= :openStart', {openStart: openStart});
            countBuilder.andWhere('create_time >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('create_time <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('create_time <= :openEnd', {openEnd: openEnd});
        }
        if (ValidatorUtils.isNotEmpty(sortName)) {
            queryBuilder.addOrderBy(sortName, direction);
        }
        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            count: Number(count),
            result: result
        }
    }
}

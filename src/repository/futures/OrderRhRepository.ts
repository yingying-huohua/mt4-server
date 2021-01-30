import {ValidatorUtils} from '../../utils/ValidatorUtils';
import {PageNoAndPageSizeUtils} from '../../utils/PageNoAndPageSizeUtils';
import {FuturesDbManager} from '../FuturesDbManager';
import {OrderRh} from '../../entity/futures/OrderRh';

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class OrderRhRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): OrderRhRepository {
        if (OrderRhRepository.repository == null) {
            OrderRhRepository.repository = new OrderRhRepository();
        }
        return OrderRhRepository.repository;
    }

    /**
     * 用户收益列表（排行）
     * @param  accountIds 账号, 多个逗号分隔
     * @param  instrumentIds 合约id， 多个逗号分隔
     * @param  openStart
     * @param  openEnd 品种
     */
    async listUserProfit(accountIds, instrumentIds, orderDateStart, orderDateEnd, sortName, direction, pageNo, pageSize?) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder()
            .select('*');
        const countBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder()
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(accountIds)) {
            queryBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
            countBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
        }
        if (ValidatorUtils.isNotEmpty(instrumentIds)) {
            queryBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
            countBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
        }
        if (ValidatorUtils.isNotEmpty(orderDateStart)) {
            queryBuilder.andWhere('trade_time >= :orderDateStart', {orderDateStart: orderDateStart});
            countBuilder.andWhere('trade_time >= :orderDateStart', {orderDateStart: orderDateStart});
        }
        if (ValidatorUtils.isNotEmpty(orderDateEnd)) {
            queryBuilder.andWhere('trade_time <= :orderDateEnd', {orderDateEnd: orderDateEnd});
            countBuilder.andWhere('trade_time <= :orderDateEnd', {orderDateEnd: orderDateEnd});
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

    /**
     * 品种收益列表
     */
    async listProductProfit(instrumentIds, orderDateStart, orderDateEnd, sortName, direction, pageNo, pageSize?) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder()
            .select('*');
        const countBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder()
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(instrumentIds)) {
            queryBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
            countBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
        }
        if (ValidatorUtils.isNotEmpty(orderDateStart)) {
            queryBuilder.andWhere('trade_time >= :orderDateStart', {orderDateStart: orderDateStart});
            countBuilder.andWhere('trade_time >= :orderDateStart', {orderDateStart: orderDateStart});
        }
        if (ValidatorUtils.isNotEmpty(orderDateEnd)) {
            queryBuilder.andWhere('trade_time <= :orderDateEnd', {orderDateEnd: orderDateEnd});
            countBuilder.andWhere('trade_time <= :orderDateEnd', {orderDateEnd: orderDateEnd});
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

    /**
     * 品种多空分布
     */
    async listBBD(accountIds, instrumentIds, orderDateStart, orderDateEnd) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder();
        queryBuilder.select('direction');
        queryBuilder.addSelect('count(*) as count');
        if (ValidatorUtils.isNotEmpty(accountIds)) {
            queryBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
        }
        if (ValidatorUtils.isNotEmpty(instrumentIds)) {
            queryBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
        }
        if (ValidatorUtils.isNotEmpty(orderDateStart)) {
            queryBuilder.andWhere('trade_time >= :startDate', {startDate: orderDateStart});
        }
        if (ValidatorUtils.isNotEmpty(orderDateEnd)) {
            queryBuilder.andWhere('trade_time <= :endDate', {endDate: orderDateEnd});
        }
        queryBuilder.groupBy('direction');
        return queryBuilder.getRawMany();
    }

    /**
     * 多空盈亏分布
     */
    async listBBP(accountIds, instrumentIds, orderDateStart, orderDateEnd) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(OrderRh)
            .createQueryBuilder();
        queryBuilder.select('direction');
        queryBuilder.addSelect('sum(profit) as totalProfit');
        // queryBuilder.where('profit >= 0');
        if (ValidatorUtils.isNotEmpty(accountIds)) {
            queryBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
        }
        if (ValidatorUtils.isNotEmpty(instrumentIds)) {
            queryBuilder.andWhere('instrument_id in (:instrumentId)', {instrumentId: instrumentIds});
        }
        if (ValidatorUtils.isNotEmpty(orderDateStart)) {
            queryBuilder.andWhere('trade_time >= :startDate', {startDate: orderDateStart});
        }
        if (ValidatorUtils.isNotEmpty(orderDateEnd)) {
            queryBuilder.andWhere('trade_time <= :endDate', {endDate: orderDateEnd});
        }
        queryBuilder.groupBy('direction');
        return queryBuilder.getRawMany();
    }
}

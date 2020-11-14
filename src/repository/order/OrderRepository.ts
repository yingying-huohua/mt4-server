import {DbManager} from '../DbManager';
import {Order} from '../../entity/order/Order';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class OrderRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): OrderRepository {
        if (OrderRepository.repository == null) {
            OrderRepository.repository = new OrderRepository();
        }
        return OrderRepository.repository;
    }

    /**
     * order交易历史列表
     */
    async listHistory(userId, symbol, type, openStart, openEnd, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Order)
            .createQueryBuilder('history')
            .select('*');
        const countBuilder = connection
            .getRepository(Order)
            .createQueryBuilder('history')
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(userId)) {
            queryBuilder.andWhere('userId = :userId', {userId: userId});
            countBuilder.andWhere('userId = :userId', {userId: userId});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
            countBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('openTime >= :openStart', {openStart: openStart});
            countBuilder.andWhere('openTime >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('openTime <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('openTime <= :openEnd', {openEnd: openEnd});
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
     * 持仓列表
     */
    async listPosition(userId, symbol, type, openStart, openEnd, comment, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Order)
            .createQueryBuilder('position')
            .select('*');
        const countBuilder = connection
            .getRepository(Order)
            .createQueryBuilder('position')
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(userId)) {
            queryBuilder.andWhere('userId like :userId', {userId: userId+"%"});
            countBuilder.andWhere('userId like :userId', {userId: userId+"%"});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
            countBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        if (ValidatorUtils.isNotEmpty(comment)) {
            queryBuilder.andWhere('comment = :comment', {comment: comment});
            countBuilder.andWhere('comment = :comment', {comment: comment});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('openTime >= :openStart', {openStart: openStart});
            countBuilder.andWhere('openTime >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('openTime <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('openTime <= :openEnd', {openEnd: openEnd});
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
     * 收益排行
     */
    async listProfit(userid, standardSymbol, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();
        const userSearch = connection
            .getRepository(Order)
            .createQueryBuilder('profit')
            .select('*');
        if (ValidatorUtils.isNotEmpty(sortName)) {
            userSearch.addOrderBy(sortName, direction);
        }
        if (ValidatorUtils.isNotEmpty(sortName)) {
            userSearch.addOrderBy(sortName, direction);
        }
        userSearch.groupBy('userId');

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        userSearch.take(pageSize);
        userSearch.skip(pageNo * pageSize);
        const result = await userSearch.getRawMany();

        return result;
    }
}

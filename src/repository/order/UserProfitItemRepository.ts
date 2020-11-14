import {DbManager} from '../DbManager';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {UserProfitItem} from "../../entity/order/UserProfitItem";
import {Symbol} from "../../entity/order/Symbol";
import {User} from "../../entity/user/User";
import {Order} from "../../entity/order/Order";

/**
 *
 *@since
 *@author
 *@date 2020/10/17 16:28
 */
export class UserProfitItemRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): UserProfitItemRepository {
        if (UserProfitItemRepository.repository == null) {
            UserProfitItemRepository.repository = new UserProfitItemRepository();
        }
        return UserProfitItemRepository.repository;
    }

    /**
     * 用户收益: 排名
     */
    async listProfit(accountId, symbol, openStart, openEnd, minReturn, maxReturn, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(UserProfitItem);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('accountId');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('userId');
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.addSelect('symbol');
        }
        queryBuilder.addSelect('sum(profit)',   'totalProfit');
        if (ValidatorUtils.isNotEmpty(accountId)) {
            queryBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
            countBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
            countBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
            countBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
        }
        if (ValidatorUtils.isNotEmpty(minReturn)) {
            queryBuilder.andWhere('returnRate >= :minReturn', {minReturn: minReturn});
            countBuilder.andWhere('returnRate >= :minReturn', {minReturn: minReturn});
        }
        if (ValidatorUtils.isNotEmpty(maxReturn)) {
            queryBuilder.andWhere('returnRate <= :maxReturn', {maxReturn: maxReturn});
            countBuilder.andWhere('returnRate <= :maxReturn', {maxReturn: maxReturn});
        }
        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
           queryBuilder.groupBy('accountId, symbol');
           countBuilder.groupBy('accountId, symbol');
        }else{
           queryBuilder.groupBy('accountId');
           countBuilder.groupBy('accountId');
        }
        if (ValidatorUtils.isNotEmpty(sortName)) {
            queryBuilder.addOrderBy(sortName, direction);
        } else {
            queryBuilder.addOrderBy('totalProfit', 'ASC');
        }

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
        // return result;
        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }


    /**
     * 用户收益详细
     */
    async listProfitDetail(accountId, symbol, openStart, openEnd, returnType, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(UserProfitItem);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');

        if (ValidatorUtils.isNotEmpty(accountId)) {
            queryBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
            countBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
            countBuilder.andWhere('symbol like :symbol', {symbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
            countBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
        }
        if (ValidatorUtils.isNotEmpty(returnType)) {
            if(returnType === '1'){
                queryBuilder.andWhere('profit > 0');
                countBuilder.andWhere('profit > 0');
            }else if(returnType === '2'){
                queryBuilder.andWhere('profit < 0');
                countBuilder.andWhere('profit < 0');
            }else{
                queryBuilder.andWhere('profit = 0');
                countBuilder.andWhere('profit = 0');
            }
        }

        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        if (ValidatorUtils.isNotEmpty(sortName)) {
            queryBuilder.addOrderBy(sortName, direction);
        } else {
            queryBuilder.addOrderBy('profit', 'ASC');
        }

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();

        // return result;

        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }

    /**
     * 品种交易排名: 成交额排名
     */
    async listSymbolAmount(symbol, openStart, openEnd, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(Order);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('symbol');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('accountId');
        queryBuilder.addSelect('sum(lots*closePrice)', 'totalTradeMount');

        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol = :symbol', {symbol: symbol});
            countBuilder.andWhere('symbol = :symbol', {symbol: symbol});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
            countBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
        }
        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        queryBuilder.groupBy('accountId');
        countBuilder.groupBy('accountId');

        if (ValidatorUtils.isNotEmpty(sortName)) {
            queryBuilder.addOrderBy(sortName, direction);
        } else {
            queryBuilder.addOrderBy('totalTradeMount', 'DESC');
        }

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
        // return result;
        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }
}

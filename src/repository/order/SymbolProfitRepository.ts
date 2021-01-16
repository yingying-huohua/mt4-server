import {DbManager} from '../DbManager';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {UserProfitItem} from "../../entity/forex/UserProfitItem";
import {SymbolProfit} from "../../entity/forex/SymbolProfit";
import {UserActive} from "../../entity/user/UserActive";

/**
 * 品种收益占比
 *@since
 *@author
 *@date 2020/10/18 16:28
 */
export class SymbolProfitRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): SymbolProfitRepository {
        if (SymbolProfitRepository.repository == null) {
            SymbolProfitRepository.repository = new SymbolProfitRepository();
        }
        return SymbolProfitRepository.repository;
    }

    /**
     * 品种收益占比
     */
    async listProfit(symbol, openStart, openEnd, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(SymbolProfit);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('standardSymbol');
        queryBuilder.addSelect('profit');
        queryBuilder.addSelect('loss');
        queryBuilder.addSelect('breakEven');
        queryBuilder.addSelect('type');
        queryBuilder.addSelect('tradeDate');
        countBuilder.select('count(*)', 'count');

        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
            countBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
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
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }


    /**
     * 品种收益用户列表
     */
    async listProfitUser(symbol, openStart, openEnd, returnRate, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(UserProfitItem);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');

        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
            countBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(openStart)) {
            queryBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
            countBuilder.andWhere('tradeDate >= :openStart', {openStart: openStart});
        }
        if (ValidatorUtils.isNotEmpty(openEnd)) {
            queryBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
            countBuilder.andWhere('tradeDate <= :openEnd', {openEnd: openEnd});
        }
        if (ValidatorUtils.isNotEmpty(returnRate)) {
            queryBuilder.andWhere('returnRate >= :returnRate', {returnRate: returnRate});
            countBuilder.andWhere('returnRate >= :returnRate', {returnRate: returnRate});
        }
        if (ValidatorUtils.isNotEmpty(returnRate)) {
            queryBuilder.andWhere('returnRate <= :returnRate', {returnRate: returnRate});
            countBuilder.andWhere('returnRate <= :returnRate', {returnRate: returnRate});
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
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }

    /**
     * 活跃品种排名
     */
    async listSymbolActive(tradeDateStart, tradeDateEnd, pageNo, pageSize?) {

        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(SymbolProfit);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('standardSymbol');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('sum(tradeCount)',   'totalCount');
        queryBuilder.addSelect('sum(tradeMoney)',   'totalTradeMoney');

        if (ValidatorUtils.isNotEmpty(tradeDateStart)) {
            queryBuilder.andWhere('tradeDate >= :tradeDateStart', {tradeDateStart: tradeDateStart});
            countBuilder.andWhere('tradeDate >= :tradeDateStart', {tradeDateStart: tradeDateStart});
        }
        if (ValidatorUtils.isNotEmpty(tradeDateEnd)) {
            queryBuilder.andWhere('tradeDate <= :tradeDateEnd', {tradeDateEnd: tradeDateEnd});
            countBuilder.andWhere('tradeDate <= :tradeDateEnd', {tradeDateEnd: tradeDateEnd});
        }
        queryBuilder.groupBy('standardSymbol');
        countBuilder.groupBy('standardSymbol');

        queryBuilder.addOrderBy("totalCount", "DESC");

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
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

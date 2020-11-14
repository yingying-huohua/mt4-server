import {DbManager} from '../DbManager';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {UserActive} from "../../entity/user/UserActive";

/**
 * 活跃用户统计
 *@since
 *@author
 *@date 2020/10/30 11:00
 */
export class UserActiveRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): UserActiveRepository {
        if (UserActiveRepository.repository == null) {
            UserActiveRepository.repository = new UserActiveRepository();
        }
        return UserActiveRepository.repository;
    }

    /**
     * 活跃用户排名
     */
    async listActive(symbol, tradeDateStart, tradeDateEnd, pageNo, pageSize?) {

        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(UserActive);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('accountId');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('userId');
        queryBuilder.addSelect('sum(tradeCount)',   'totalCount');
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
            countBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(tradeDateStart)) {
            queryBuilder.andWhere('tradeDate >= :tradeDateStart', {tradeDateStart: tradeDateStart});
            countBuilder.andWhere('tradeDate >= :tradeDateStart', {tradeDateStart: tradeDateStart});
        }
        if (ValidatorUtils.isNotEmpty(tradeDateEnd)) {
            queryBuilder.andWhere('tradeDate <= :tradeDateEnd', {tradeDateEnd: tradeDateEnd});
            countBuilder.andWhere('tradeDate <= :tradeDateEnd', {tradeDateEnd: tradeDateEnd});
        }
        queryBuilder.groupBy('userId');
        countBuilder.groupBy('userId');

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


    /**
     * 活跃品种排名
     */
    async listSymbolActive(tradeDateStart, tradeDateEnd, pageNo, pageSize?) {

        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(UserActive);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('standardSymbol');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('sum(tradeCount)',   'totalCount');

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

import {DbManager} from '../DbManager';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {UserProfitItem} from "../../entity/forex/UserProfitItem";
import {UserProfitTotal} from "../../entity/forex/UserProfitTotal";

/**
 * 用户总收益
 *@since
 *@author
 *@date 2020/10/17 16:28
 */
export class UserProfitTotalRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): UserProfitTotalRepository {
        if (UserProfitTotalRepository.repository == null) {
            UserProfitTotalRepository.repository = new UserProfitTotalRepository();
        }
        return UserProfitTotalRepository.repository;
    }

    /**
     * 用户总收益
     */
    async listProfit(symbol, accountId, sortName, direction, pageNo, pageSize?) {
        const dbManager  = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(UserProfitTotal);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('accountId');
        countBuilder.select('count(*)', 'count');

        queryBuilder.addSelect('userId');
        queryBuilder.addSelect('profit');

        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('standardSymbol = :standardSymbol', {standardSymbol: symbol});
            countBuilder.andWhere('standardSymbol = :standardSymbol', {standardSymbol: symbol});
        }
        if (ValidatorUtils.isNotEmpty(accountId)) {
            queryBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
            countBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
        }
        if (ValidatorUtils.isNotEmpty(sortName)) {
            queryBuilder.addOrderBy(sortName, direction);
        }else{
            queryBuilder.addOrderBy('profit', 'ASC');
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

}

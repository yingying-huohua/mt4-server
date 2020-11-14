import {DbManager} from '../DbManager';
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {UserProfitItem} from "../../entity/order/UserProfitItem";
import {SymbolProfit} from "../../entity/order/SymbolProfit";
import {GroupProfit} from "../../entity/order/GroupProfit";

/**
 * 用户组收益
 *@since
 *@author
 *@date 2020/10/18 16:28
 */
export class GroupProfitRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): GroupProfitRepository {
        if (GroupProfitRepository.repository == null) {
            GroupProfitRepository.repository = new GroupProfitRepository();
        }
        return GroupProfitRepository.repository;
    }

    /**
     * 组收益列表
     */
    async listProfit(groupName, openStart, openEnd, type, sortName, direction, pageNo, pageSize?) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        let repository = connection.getRepository(GroupProfit);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('groupId');
        queryBuilder.addSelect('groupName');
        queryBuilder.addSelect('groupAbbr');
        queryBuilder.addSelect('profit');
        queryBuilder.addSelect('returnRate');
        queryBuilder.addSelect('userCount');
        queryBuilder.addSelect('tradeDate');
        queryBuilder.addSelect('type');

        countBuilder.select('count(*)', 'count');

        if (ValidatorUtils.isNotEmpty(groupName)) {
            queryBuilder.andWhere('groupName = :groupName', {groupName: groupName});
            countBuilder.andWhere('groupName = :groupName', {groupName: groupName});
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

        let repository = connection.getRepository(GroupProfit);
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
}

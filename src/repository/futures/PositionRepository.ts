import {DbManager} from '../DbManager';
import {ValidatorUtils} from '../../utils/ValidatorUtils';
import {PageNoAndPageSizeUtils} from '../../utils/PageNoAndPageSizeUtils';
import {OrderRh} from '../../entity/futures/OrderRh';
import {Position} from '../../entity/futures/Position';
import {FuturesDbManager} from '../FuturesDbManager';

/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class PositionRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): PositionRepository {
        if (PositionRepository.repository == null) {
            PositionRepository.repository = new PositionRepository();
        }
        return PositionRepository.repository;
    }

    /**
     * 持仓列表
     */
    async listPosition(accountIds, productId, openStart, openEnd, sortName, direction, pageNo, pageSize?) {
        const dbManager = await FuturesDbManager.getInstance();
        const connection = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(Position)
            .createQueryBuilder('position')
            .select('*');
        const countBuilder = connection
            .getRepository(Position)
            .createQueryBuilder('position')
            .select('count(1)', 'count');
        if (ValidatorUtils.isNotEmpty(accountIds)) {
            queryBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
            countBuilder.andWhere('investor_id in (:accountIds)', {accountIds: accountIds});
        }
        if (ValidatorUtils.isNotEmpty(productId)) {
            queryBuilder.andWhere('product_id = :productId', {productId: productId});
            countBuilder.andWhere('product_id = :productId', {productId: productId});
        }
        // if (ValidatorUtils.isNotEmpty(openStart)) {
        //     queryBuilder.andWhere('create_time >= :openStart', {openStart: openStart});
        //     countBuilder.andWhere('create_time >= :openStart', {openStart: openStart});
        // }
        // if (ValidatorUtils.isNotEmpty(openEnd)) {
        //     queryBuilder.andWhere('create_time <= :openEnd', {openEnd: openEnd});
        //     countBuilder.andWhere('create_time <= :openEnd', {openEnd: openEnd});
        // }
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

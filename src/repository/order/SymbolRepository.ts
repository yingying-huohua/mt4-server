import {DbManager} from '../DbManager';
import {Symbol} from '../../entity/order/Symbol';
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {ValidatorUtils} from "../../utils/ValidatorUtils";


/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class SymbolRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): SymbolRepository {
        if (SymbolRepository.repository == null) {
            SymbolRepository.repository = new SymbolRepository();
        }
        return SymbolRepository.repository;
    }

    /**
     *  品种列表
     */
    async list(symbol, type, status, pageNo, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        let repository = connection.getRepository(Symbol);

        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');
        queryBuilder.where('1=1');
        countBuilder.where('1=1');

        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
            countBuilder.andWhere('standardSymbol like :standardSymbol', {standardSymbol: symbol+"%"});
        }
        if (ValidatorUtils.isNotEmpty(type)) {
            queryBuilder.andWhere('type = :type', {type: type});
            countBuilder.andWhere('type = :type', {type: type});
        }
        queryBuilder.groupBy('standardSymbol');
        countBuilder.groupBy('standardSymbol');

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        pageSize = PageNoAndPageSizeUtils.getPageSize(pageSize);
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
     * 查看详情
     * @param id
     */
    async get(id) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const SymbolSearch = connection
            .getRepository(Symbol)
            .createQueryBuilder('symbol')
            .where('id = :id', {id: id});
        return await SymbolSearch.getOne();
    }

    /**
     *  新增
     */
    async add(symbol) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const symbolSearch    = connection
            .createQueryBuilder()
            .insert()
            .into(Symbol)
            .values([symbol])
            .execute();
    }

    /**
     *  更新
     */
    async update(symbol) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const symbolSearch = connection
            .createQueryBuilder()
            .update(Symbol)
            .set(symbol)
            .where('id = :id', { id: symbol.id })
            .execute();
    }

}

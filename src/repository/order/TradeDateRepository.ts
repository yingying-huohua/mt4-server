import {DbManager} from '../DbManager';
import {TradeDate} from '../../entity/order/TradeDate';
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";


/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class TradeDateRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): TradeDateRepository {
        if (TradeDateRepository.repository == null) {
            TradeDateRepository.repository = new TradeDateRepository();
        }
        return TradeDateRepository.repository;
    }

    /**
     *  交易时间设置列表
     */
    async list(pageNo, type, status, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const tradeDateSearch = connection
            .getRepository(TradeDate)
            .createQueryBuilder('tradeDate')
            .select('*');
        tradeDateSearch.where('1=1');
        pageNo   = PageNoAndPageSizeUtils.getPageNo(pageNo);
        pageSize = PageNoAndPageSizeUtils.getPageSize(pageSize);
        tradeDateSearch.take(pageSize);
        tradeDateSearch.skip((pageNo - 1) * pageSize);
        const result = await tradeDateSearch.getRawMany();
        return {
            result: result,
            currentPage: pageNo
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
            .getRepository(TradeDate)
            .createQueryBuilder('tradeDate')
            .where('id = :id', {id: id});
        return await SymbolSearch.getOne();
    }

    /**
     *  新增
     */
    async add(tradeDate) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const tradeDateSearch    = connection
            .createQueryBuilder()
            .insert()
            .into(TradeDate)
            .values([tradeDate])
            .execute();
    }

    /**
     *  更新
     */
    async update(tradeDate) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const tradeDateSearch = connection
            .createQueryBuilder()
            .update(TradeDate)
            .set(tradeDate)
            .where('id = :id', { id: tradeDate.id })
            .execute();
    }

}

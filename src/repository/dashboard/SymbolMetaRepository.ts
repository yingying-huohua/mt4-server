import {DbManager} from '../DbManager';
import {SymbolMeta} from "../../entity/meta/SymbolMeta";
import {UserActive} from "../../entity/user/UserActive";
import {ValidatorUtils} from "../../utils/ValidatorUtils";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";

/**
 * 品种概要
 *@since
 *@author
 *@date 2020/10/24 16:28
 */
export class SymbolMetaRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): SymbolMetaRepository {
        if (SymbolMetaRepository.repository == null) {
            SymbolMetaRepository.repository = new SymbolMetaRepository();
        }
        return SymbolMetaRepository.repository;
    }

    /**
     * 品种概要信息
     */
    async get(symbol) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(SymbolMeta)
            .createQueryBuilder('symbolMeta')
            .where('standardSymbol = :standardSymbol', {standardSymbol: symbol});
        return await queryBuilder.getOne();
    }


    /**
     * 品种总盈亏
     */
    async getTotal() {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(SymbolMeta);
        const queryBuilder = await repository.createQueryBuilder();

        queryBuilder.select('sum(SymbolMeta.totalProfit)',         'totalProfit');             // 总收益
        queryBuilder.addSelect('sum(SymbolMeta.userCount)',           'totalUser');               // 总用户数
        queryBuilder.addSelect('sum(SymbolMeta.profitUserCount)',     'totalProfitUserCount');    // 盈利总人数
        queryBuilder.addSelect('sum(SymbolMeta.lossUserCount)',       'totalLossUserCount');      // 亏损总人数
        queryBuilder.addSelect('sum(SymbolMeta.breakEvenUserCount)',  'totalBreakEvenUserCount'); // 持平总人数

        const result = await queryBuilder.getRawMany();

        let totalResult = {
            standardSymbol: result[0].standardSymbol,
            totalProfit: result[0].totalProfit,
            userCount: result[0].totalUser,
            profitUserCount: result[0].totalProfitUserCount,
            lossUserCount: result[0].totalLossUserCount,
            breakEvenUserCount: result[0].totalBreakEvenUserCount,
            profitRate: parseInt(result[0].totalProfitUserCount)/ parseInt(result[0].totalUser),
            lossRate: parseInt(result[0].totalLossUserCount)/ parseInt(result[0].totalUser),
            breakEvenRate: parseInt(result[0].totalBreakEvenUserCount)/ parseInt(result[0].totalUser),
        }
        return totalResult;
    }



}

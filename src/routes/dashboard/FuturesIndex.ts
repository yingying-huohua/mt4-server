/**
 * 期货看板
 *@since
 *@author
 *@date 2020/11/14
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {Constant} from "../../config/Constant";
import {SymbolProfitRepository} from "../../repository/order/SymbolProfitRepository";


const router = Express.Router();

// 总盈亏
const getSymbolTotal = async (req: Request, res: Response) => {
    // const result     = await SymbolMetaRepository.getInstance().getTotal();
    res.send({});
};
// TODO 趋势

// 活跃排行
const listActive = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const tradeStart         = req.query.tradeStart;          // 交易开始
    const tradeEnd           = req.query.tradeEnd;            // 交易结束
    const standardSymbol     = req.query.standardSymbol;      // 品种

    // const result       = await UserActiveRepository.getInstance().listActive(symbol, tradeStart, tradeEnd, pageNo, pageSize)
    res.send({});
};

// 活跃品种排行： 品种交易总次数排行
const listSymbolActive = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const tradeStart         = req.query.tradeStart;          // 交易开始
    const tradeEnd           = req.query.tradeEnd;            // 交易结束

    // const result       = await UserActiveRepository.getInstance().listSymbolActive(tradeStart, tradeEnd, pageNo, pageSize)
    // const result       = await SymbolProfitRepository.getInstance().listSymbolActive(tradeStart, tradeEnd, pageNo, pageSize)

    res.send({});
};

// 人员收益排行
const listUserTotalProfit = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountId          = req.query.accountId;          // 账号
    const sort               = req.query.sortField;          // 排序字段
    const direction          = req.query.direction;          // 升降序
    const standardSymbol     = req.query.standardSymbol;     // 品种

    // const result       = await UserProfitTotalRepository.getInstance().listProfit(accountId, sort, direction, pageNo, pageSize)

    res.send({});
};

router.get('/meta',               getSymbolTotal);         // 品种总收益
router.get('/user/active/list',   listActive);             // 活跃排名
router.get('/symbol/active/list', listSymbolActive);       // 活跃品种排名
router.get('/user/profit/list',   listUserTotalProfit);    // 用户总收益列表


export = router;

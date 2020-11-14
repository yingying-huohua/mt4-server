/**
 * 品种看板
 *@since
 *@author
 *@date 2020/10/24 11:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {SymbolMetaRepository} from "../../repository/dashboard/SymbolMetaRepository";
import {Constant} from "../../config/Constant";
import {UserActiveRepository} from "../../repository/user/UserActiveRepository";
import {UserProfitTotalRepository} from "../../repository/order/UserProfitTotalRepository";
import {UserProfitItemRepository} from "../../repository/order/UserProfitItemRepository";


const router = Express.Router();

// 总盈亏
const getSymbolMeta = async (req: Request, res: Response) => {
    const standardSymbol        = req.query.standardSymbol;
    const result    = await SymbolMetaRepository.getInstance().get(standardSymbol);
    res.send(result);
};
// TODO 趋势

// 活跃排行
const listActive = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const tradeStart         = req.query.tradeStart;          // 交易开始
    const tradeEnd           = req.query.tradeEnd;            // 交易结束
    const symbol             = req.query.symbol;              // 品种

    const result       = await UserActiveRepository.getInstance().listActive(symbol, tradeStart, tradeEnd, pageNo, pageSize)

    res.send(result);
};

// 交易额排行
const listUserAmount = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const tradeStart         = req.query.tradeStart;          // 交易开始
    const tradeEnd           = req.query.tradeEnd;            // 交易结束
    const standardSymbol     = req.query.standardSymbol;      // 品种
    const type               = req.query.type;                // 类型：外汇 期货
    const sort               = req.query.sortField;           // 排序字段
    const direction          = req.query.direction;           // 升降序

    const result       = await UserProfitItemRepository.getInstance().listSymbolAmount(standardSymbol, tradeStart, tradeEnd, type, sort, direction, pageNo, pageSize);

    res.send(result);
};

// 人员收益排行
const listUserTotalProfit = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountId          = req.query.accountId;          // 账号
    const sort               = req.query.sortField;          // 排序字段
    const direction          = req.query.direction;          // 升降序
    const standardSymbol     = req.query.standardSymbol;     // 品种

    const result       = await UserProfitTotalRepository.getInstance().listProfit(standardSymbol, accountId, sort, direction, pageNo, pageSize)

    res.send(result);
};

router.get('/meta',               getSymbolMeta);          // 品种基本信息
router.get('/user/active/list',   listActive);             // 活跃用户排名
router.get('/user/amount/list',   listUserAmount);         // 用户交易额排名
router.get('/user/profit/list',   listUserTotalProfit);    // 用户总收益列表

export = router;

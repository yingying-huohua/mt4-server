/**
 *
 *@since
 *@author
 *@date 2020/10/8 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {OrderRepository} from '../../repository/order/OrderRepository';
import {UserProfitItemRepository} from '../../repository/order/UserProfitItemRepository';
import {Constant} from "../../config/Constant";
import {GroupProfitRepository} from "../../repository/order/GroupProfitRepository";
import {SymbolProfitRepository} from "../../repository/order/SymbolProfitRepository";
import {deprecate} from "util";

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const router = Express.Router();

// 交易历史
const listHistory = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const userid       = req.query.userid;         // 账号
    const symbol       = req.query.standardSymbol; // 品种
    const type         = req.query.type;           // 买卖方向
    const openStart    = req.query.openStart;      // 开仓时间
    const openEnd      = req.query.openEnd;        // 平仓时间
    const sort         = req.query.sortField;      // 排序字段
    const direction    = req.query.direction;      // 升降序

    const result       = await OrderRepository.getInstance().listHistory(userid, symbol, type, openStart, openEnd, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 实时持仓
const listPosition = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const userid       = req.query.userid;         // 账号
    const symbol       = req.query.symbol; // 品种
    const type         = req.query.type;           // 买卖方向
    const openStart    = req.query.openStart;      // 开仓时间
    const openEnd      = req.query.openEnd;        // 平仓时间
    const comment      = req.query.comment;        // 备注
    const sort         = req.query.sortField;      // 排序字段
    const direction    = req.query.direction;      // 升降序

    const result       = await OrderRepository.getInstance().listPosition(userid, symbol, type, openStart, openEnd, comment, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 用户收益排行统计按时间段、品种
const listProfit = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountId          = req.query.accountId;          // 账号
    const standardSymbol     = req.query.standardSymbol;     // 品种
    const openStart          = req.query.openStart;          // 开仓时间
    const openEnd            = req.query.openEnd;            // 平仓时间
    const minReturn          = req.query.minReturn;          // 收益率
    const maxReturn          = req.query.maxReturn;          // 收益率
    const type               = req.query.type;               // 类型：外汇 期货
    const sort               = req.query.sortField;          // 排序字段
    const direction          = req.query.direction;          // 升降序

    const result       = await UserProfitItemRepository.getInstance().listProfit(accountId, standardSymbol, openStart, openEnd, minReturn, maxReturn, type, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 用户收益明细
const listUserProfit = async (req: Request, res: Response) => {
    const pageNo             = req.query.pageNo || 1;
    const pageSize           = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountId          = req.query.accountId;          // 账号
    const standardSymbol     = req.query.standardSymbol;     // 品种
    const openStart          = req.query.openStart;          // 开仓时间
    const openEnd            = req.query.openEnd;            // 平仓时间
    const type               = req.query.type;               // 类型：外汇 期货
    const sort               = req.query.sortField;          // 排序字段
    const direction          = req.query.direction;          // 升降序
    const returnType         = null;                         // 收益类型： 1： 盈利， 2亏损， 3：持平

    const result       = await UserProfitItemRepository.getInstance().listProfitDetail(accountId, standardSymbol, openStart, openEnd, returnType , type, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 用户组收益
const listGroupProfit = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const groupName    = req.query.groupName;      // 组名称
    const openStart    = req.query.openStart;      // 开仓时间
    const openEnd      = req.query.openEnd;        // 平仓时间
    const type         = req.query.type;           // 类型：外汇 期货
    const sort         = req.query.sortField;      // 排序字段
    const direction    = req.query.direction;      // 升降序

    const result       = await GroupProfitRepository.getInstance().listProfit(groupName, openStart, openEnd, type, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 品种收益（盈亏占比）
const listSymbolProfit = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const standardSymbol = req.query.standardSymbol;         // 品种
    const openStart    = req.query.openStart;      // 开仓时间
    const openEnd      = req.query.openEnd;        // 平仓时间
    const type         = req.query.type;           // 类型：外汇 期货
    const sort         = req.query.sortField;      // 排序字段
    const direction    = req.query.direction;      // 升降序

    const result       = await SymbolProfitRepository.getInstance().listProfit(standardSymbol, openStart, openEnd, type, sort, direction, pageNo, pageSize)

    res.send(result);
};

// 品种收益用户列表: 品种有哪些用户以及其收益（盈利、亏损、持平）
const listSymbolProfitUser = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const standardSymbol  = req.query.standardSymbol;         // 品种
    const returnType   = req.query.returnType;     // 收益类型： 1：盈利用户，2：亏损用户， 3：持平用户
    const type         = req.query.type;           // 类型：外汇 期货
    const openStart    = req.query.openStart;      // 开仓时间
    const openEnd      = req.query.openEnd;        // 平仓时间
    const sort         = req.query.sortField;      // 排序字段
    const direction    = req.query.direction;      // 升降序

    const result       = await UserProfitItemRepository.getInstance().listProfitDetail(null, standardSymbol, openStart, openEnd, returnType, type, sort, direction, pageNo, pageSize)

    res.send(result);
};

router.get('/history',  listHistory);  // 交易历史
router.get('/position', listPosition); // 实时持仓
router.get('/profit/user/list',         listProfit);             // 用户收益排行
router.get('/profit/user/detail',       listUserProfit);         // 用户收益明细
router.get('/profit/group/list',        listGroupProfit);        // 组收益
router.get('/profit/group/user/list',   listGroupProfit);        // 组用户收益列表
router.get('/profit/symbol/list',       listSymbolProfit);       // 品种收益盈亏占比
router.get('/profit/symbol/user/list',  listSymbolProfitUser);   // 品种收益盈亏用户列表

export = router;

/**
 * 期货订单
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {OrderRhRepository} from '../../repository/futures/OrderRhRepository';
import {Constant} from '../../config/Constant';
import {InstrumentRepository} from '../../repository/futures/InstrumentRepository';
import {ValidatorUtils} from '../../utils/ValidatorUtils';


const router = Express.Router();

// 用户收益
const listUserProfit = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountIds   = req.query.accountIds;        // 账号
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 成交时间
    const openEnd      = req.query.openEnd;           // 成交时间
    const sort         = req.query.sortField;         // 排序字段
    const direction    = req.query.direction;         // 升降序

    // console.log('listUserProfit >> accountIds:', accountIds);
    let result = {};

    let userIdArray = [];
    if (ValidatorUtils.isNotEmpty(accountIds)) {
        const idsArr = accountIds.toString().split(',');
        for (const item of idsArr) {
            userIdArray.push(item);
        }
    }

    let instrumentIdArray = [];
    if(ValidatorUtils.isNotEmpty(productId)){
        let instrumentIds = await InstrumentRepository.getInstance().listInstrumentIds(productId);
        if(ValidatorUtils.isEmpty(instrumentIds)){
            result = {};
            res.send(result);
            return;
        }
        for (const instrument of instrumentIds) {
            instrumentIdArray.push(instrument.instrument_id);
        }
    }
    // console.log('listUserProfit >> instrumentIds:', instrumentIdArray);

    result  = await OrderRhRepository.getInstance().listUserProfit(userIdArray,instrumentIdArray,openStart,openEnd,sort,direction,pageNo, pageSize);

    res.send(result);
};

// 品种收益
const listProductProfit = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 成交时间
    const openEnd      = req.query.openEnd;           // 成交时间
    const sort         = req.query.sortField;         // 排序字段
    const direction    = req.query.direction;         // 升降序

    let result = {};

    let instrumentIdArray = [];
    if(ValidatorUtils.isNotEmpty(productId)){
        let instrumentIds = await InstrumentRepository.getInstance().listInstrumentIds(productId);
        if(ValidatorUtils.isEmpty(instrumentIds)){
            result = {};
            res.send(result)
            return;
        }
        for (const instrument of instrumentIds) {
            instrumentIdArray.push(instrument.instrument_id);
        }
    }
    // console.log('listUserProfit >> instrumentIds:', instrumentIdArray);

    result  = await OrderRhRepository.getInstance().listProductProfit(instrumentIdArray,openStart,openEnd,sort,direction,pageNo, pageSize);

    res.send(result);
};

// 多空分布
const getBBD = async (req: Request, res: Response) => {
    const accountIds   = req.query.accountIds;        // 账号
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 成交时间
    const openEnd      = req.query.openEnd;           // 成交时间

    let result = {};

    let userIdArray = [];
    if (ValidatorUtils.isNotEmpty(accountIds)) {
        const idsArr = accountIds.toString().split(',');
        for (const item of idsArr) {
            userIdArray.push(item);
        }
    }

    let instrumentIdArray = [];
    if(ValidatorUtils.isNotEmpty(productId)){
        let instrumentIds = await InstrumentRepository.getInstance().listInstrumentIds(productId);
        if(ValidatorUtils.isEmpty(instrumentIds)){
            result = {};
            res.send(result)
            return;
        }
        for (const instrument of instrumentIds) {
            instrumentIdArray.push(instrument.instrument_id);
        }
    }
    // console.log('listUserProfit >> instrumentIds:', instrumentIdArray);

    result  = await OrderRhRepository.getInstance().listBBD(userIdArray, instrumentIdArray,openStart,openEnd);
    // console.info('get bbd : ', result);
    let data = [];
    if(ValidatorUtils.isNotEmpty(result)){
        let direction0 = {
            "direction": "多单",
            "count": result[0].count
        };
        let direction1 = {
            "direction": "空单",
            "count": result[1].count
        };
        data.push(direction0);
        data.push(direction1);
    }
    res.send(data);
};

// 多空盈亏分布
const getBBP = async (req: Request, res: Response) => {
    const accountIds   = req.query.accountIds;        // 账号
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 成交时间
    const openEnd      = req.query.openEnd;           // 成交时间

    let result = {};

    let userIdArray = [];
    if (ValidatorUtils.isNotEmpty(accountIds)) {
        const idsArr = accountIds.toString().split(',');
        for (const item of idsArr) {
            userIdArray.push(item);
        }
    }

    let instrumentIdArray = [];
    if(ValidatorUtils.isNotEmpty(productId)){
        let instrumentIds = await InstrumentRepository.getInstance().listInstrumentIds(productId);
        if(ValidatorUtils.isEmpty(instrumentIds)){
            result = {};
            res.send(result)
            return;
        }
        for (const instrument of instrumentIds) {
            instrumentIdArray.push(instrument.instrument_id);
        }
    }
    // console.log('listUserProfit >> instrumentIds:', instrumentIdArray);

    result  = await OrderRhRepository.getInstance().listBBP(userIdArray, instrumentIdArray,openStart,openEnd);
    // console.info('get BBP : ', result);
    let data = [];
    if(ValidatorUtils.isNotEmpty(result)){
        let direction0 = {
            "direction": "多单",
            "totalProfit": result[0].totalProfit
        };
        let direction1 = {
            "direction": "空单",
            "totalProfit": result[1].totalProfit
        };
        data.push(direction0);
        data.push(direction1);
    }
    res.send(data);
};

// 持仓时间分布
const getPositionDistribute = async (req: Request, res: Response) => {
    const accountIds   = req.query.accountIds;        // 账号
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 成交时间
    const openEnd      = req.query.openEnd;           // 成交时间

    let result = {};

    let userIdArray = [];
    if (ValidatorUtils.isNotEmpty(accountIds)) {
        const idsArr = accountIds.toString().split(',');
        for (const item of idsArr) {
            userIdArray.push(item);
        }
    }

    let instrumentIdArray = [];
    if(ValidatorUtils.isNotEmpty(productId)){
        let instrumentIds = await InstrumentRepository.getInstance().listInstrumentIds(productId);
        if(ValidatorUtils.isEmpty(instrumentIds)){
            result = {};
            res.send(result)
            return;
        }
        for (const instrument of instrumentIds) {
            instrumentIdArray.push(instrument.instrument_id);
        }
    }
    // console.log('listUserProfit >> instrumentIds:', instrumentIdArray);

    result  = await OrderRhRepository.getInstance().listTopPosition(userIdArray, instrumentIdArray,openStart,openEnd);

    // result = {
    //     "product": "动力煤(ZC),动力煤(TC),天然橡胶(ru)",
    //     "day": "15,10,8"
    // }

    res.send(result);
};


router.get('/user/list', listUserProfit);                      // 用户收益
router.get('/product/list', listProductProfit);                // 品种收益
router.get('/bbd', getBBD);                                    // 品种多空分布
router.get('/bbp', getBBP);                                    // 多空盈亏分布
router.get('/position/distribute', getPositionDistribute);     // 持仓时间分布

export = router;

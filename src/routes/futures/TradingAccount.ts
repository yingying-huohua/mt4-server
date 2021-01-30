/**
 * 期货账号
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {ProductRepository} from '../../repository/futures/ProductRepository';
import {TradingAccountRepository} from '../../repository/futures/TradingAccountRepository';
import {Constant} from '../../config/Constant';
import {ValidatorUtils} from '../../utils/ValidatorUtils';


const router = Express.Router();

// 账号列表
const listAccount = async (req: Request, res: Response) => {

    const result  = await TradingAccountRepository.getInstance().listAll();

    res.send(result);
};


// 资金一览
const listTradingAccount = async (req: Request, res: Response) => {
    const pageNo       = req.query.pageNo || 1;;
    const pageSize     = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountIds   = req.query.accountIds;        // 账号
    const productId    = req.query.productId;         // 品种
    const openStart    = req.query.openStart;         // 开仓时间
    const openEnd      = req.query.openEnd;           // 平仓时间
    const sort         = req.query.sortField;         // 排序字段
    const direction    = req.query.direction;         // 升降序

    let userIdArray = [];
    if (ValidatorUtils.isNotEmpty(accountIds)) {
        const idsArr = accountIds.toString().split(',');
        for (const item of idsArr) {
            userIdArray.push(item);
        }
    }

    const result  = await TradingAccountRepository.getInstance().listTradingAccount(userIdArray,openStart, openEnd,sort,direction,pageNo, pageSize);

    res.send(result);
};


router.get('/user/list',    listAccount);             // 用户列表
router.get('/account/list', listTradingAccount);      // 账号资金一览


export = router;

/**
 * 持仓信息
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {Constant} from '../../config/Constant';
import {PositionRepository} from '../../repository/futures/PositionRepository';
import {ValidatorUtils} from '../../utils/ValidatorUtils';


const router = Express.Router();

// 用户持仓信息列表
const listPosition = async (req: Request, res: Response) => {
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

    const result  = await PositionRepository.getInstance().listPosition(userIdArray, productId,openStart, openEnd, sort, direction, pageNo, pageSize);

    res.send(result);
};


router.get('/list', listPosition); // 当前持仓


export = router;

/**
 * 期货合约
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {ProductRepository} from '../../repository/futures/ProductRepository';
import {TradingAccountRepository} from '../../repository/futures/TradingAccountRepository';
import {InstrumentRepository} from '../../repository/futures/InstrumentRepository';


const router = Express.Router();

// 根据品种id获取合约列表
const listInstrument = async (req: Request, res: Response) => {

    const productId   = req.query.productId;         // 品种id
    const result      = await InstrumentRepository.getInstance().listInstrument(productId);

    res.send(result);
};

// 根据品种id获取合约列表
const listInstrumentIds = async (req: Request, res: Response) => {

    const productId   = req.query.productId;         // 品种id
    const result      = await InstrumentRepository.getInstance().listInstrumentIds(productId);

    res.send(result);
};


router.get('/list', listInstrument);
router.get('/ids',  listInstrumentIds);


export = router;

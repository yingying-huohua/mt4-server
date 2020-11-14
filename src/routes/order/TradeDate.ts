/**
 * 交易时间设置
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {TradeDateRepository} from "../../repository/order/TradeDateRepository";


const router = Express.Router();

// 交易时间设置
const listTradeDate = async (req: Request, res: Response) => {
    const pageNo    = req.query.pageNo || 1;
    const type      = req.query.type;
    const status    = req.query.status;
    const result    = await TradeDateRepository.getInstance().list(pageNo, type, status);
    res.send(result);
};

// 查询品种
const getTradeDate = async (req: Request, res: Response) => {
    const id        = req.query.id;
    const result    = await TradeDateRepository.getInstance().get(id);
    res.send(result);
};

// 新增
const addTradeDate = async (req: Request, res: Response) => {
    const tradeDate  = req.body;
    await TradeDateRepository.getInstance().add(tradeDate);
    res.send('success');
};

// 更新
const updateTradeDate = async (req: Request, res: Response) => {
    const tradeDate  = req.body;
    await TradeDateRepository.getInstance().update(tradeDate);
    res.send('success');
};

router.get('/list', listTradeDate);
router.get('/',     getTradeDate);
router.post('/',    addTradeDate);
router.put('/',     updateTradeDate);

export = router;

/**
 * 品种相关接口
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {SymbolRepository} from "../../repository/order/SymbolRepository";


const router = Express.Router();

// 品种列表
const listSymbol = async (req: Request, res: Response) => {
    const pageNo    = req.query.pageNo   || 1;
    const pageSize  = req.query.pageSize || 20;
    const symbol    = req.query.symbol;
    const type      = req.query.type;
    const status    = req.query.status;
    const result    = await SymbolRepository.getInstance().list(symbol, type, status, pageNo, pageSize);
    res.send(result);
};

// 查询品种
const getSymbol = async (req: Request, res: Response) => {
    const id        = req.query.id;
    const result    = await SymbolRepository.getInstance().get(id);
    res.send(result);
};

// 新增
const addSymbol = async (req: Request, res: Response) => {
    const symbol  = req.body;
    await SymbolRepository.getInstance().add(symbol);
    res.send('success');
};

// 更新
const updateSymbol = async (req: Request, res: Response) => {
    const symbol  = req.body;
    await SymbolRepository.getInstance().update(symbol);
    res.send('success');
};

router.get('/list', listSymbol);
router.get('/',     getSymbol);
router.post('/',    addSymbol);
router.put('/',     updateSymbol);

export = router;

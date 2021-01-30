/**
 * 品种相关接口
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import {ProductRepository} from '../../repository/futures/ProductRepository';


const router = Express.Router();

// 品种列表
const listProduct = async (req: Request, res: Response) => {

    const result  = await ProductRepository.getInstance().listAll();

    res.send(result);
};

// 查询品种
const getProduct = async (req: Request, res: Response) => {
    const id        = req.query.id;
    const result    = await ProductRepository.getInstance().get(id);
    res.send(result);
};

router.get('/list', listProduct);
router.get('/',     getProduct);


export = router;

/**
 * 用户相关接口
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import * as uuid from 'uuid';
import {UserRepository} from "../../repository/user/UserRepository";
import {Constant} from "../../config/Constant";


const router = Express.Router();

// 用户列表
const listUser = async (req: Request, res: Response) => {
    const pageNo      = req.query.pageNo   || 1;
    const pageSize    = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const accountId   = req.query.accountId;
    const symbol      = req.query.sybmol;
    const result      = await UserRepository.getInstance().list(accountId, symbol, pageNo, pageSize);
    res.send(result);
};

// 查询用户
const getUser = async (req: Request, res: Response) => {
    const id        = req.params.id;
    const result    = await UserRepository.getInstance().get(id);
    res.send(result);
};

// 新增
const addUser = async (req: Request, res: Response) => {
    const user  = req.body;
    user.id         = uuid.v4();
    await UserRepository.getInstance().add(user);
    res.send('success');
};

// 更新
const updateUser = async (req: Request, res: Response) => {
    const user  = req.body;
    await UserRepository.getInstance().update(user);
    res.send('success');
};

router.get('/list', listUser);
router.get('/:id',  getUser);
router.post('/',    addUser);
router.put('/',     updateUser);

export = router;

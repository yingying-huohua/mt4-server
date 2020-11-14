/**
 * 用户相关接口
 *@since
 *@author
 *@date 2020/10/9 16:27
 */

import * as Express from 'express';
import {Request, Response} from 'express';
import * as uuid from 'uuid';
import {GroupRepository} from "../../repository/user/GroupRepository";
import {Constant} from "../../config/Constant";
import {UserGroupRepository} from "../../repository/user/UserGroupRepository";


const router = Express.Router();

// 用户组列表
const listGroup = async (req: Request, res: Response) => {
    const pageNo    = req.query.pageNo;
    const searchText    = req.query.searchText;
    const type      = req.query.type;
    const status    = req.query.status;
    const result    = await GroupRepository.getInstance().list(pageNo, searchText, type, status);
    res.send(result);
};

// 查询用户组
const getGroup = async (req: Request, res: Response) => {
    const id        = req.params.id;
    const result    = await GroupRepository.getInstance().get(id);
    res.send(result);
};

// 新增
const addUserGroup = async (req: Request, res: Response) => {
    const group  = req.body;
    group.id         = uuid.v4();
    await GroupRepository.getInstance().add(group);
    res.send('success');
};

// 更新
const updateUserGroup = async (req: Request, res: Response) => {
    const group  = req.body;
    await GroupRepository.getInstance().update(group);
    res.send('success');
};

// 根据组查询组成员列表
const listUser = async (req: Request, res: Response) => {
    const pageNo      = req.query.pageNo   || 1;
    const pageSize    = req.query.pageSize || Constant.DEFAULT_PAGE_SIZE;
    const groupId     = req.query.groupId;

    const result      = await UserGroupRepository.getInstance().listUser(groupId, pageNo, pageSize);
    res.send(result);
};



router.get('/list',       listGroup);
router.get('/:id',        getGroup);
router.post('/',          addUserGroup);
router.put('/',           updateUserGroup);
router.get('/member/list',  listUser);

export = router;

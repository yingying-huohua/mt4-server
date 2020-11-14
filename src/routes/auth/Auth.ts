import * as Express from 'express';
import {Request, Response} from 'express';
import {SysUserRepository} from "../../repository/user/SysUserRepository";

const router = Express.Router();

//  登录
let login = async (req: Request, res: Response) => {
    const username  = req.query.username;
    const password  = req.query.password;

    let result = await SysUserRepository.getInstance().login(username, password);
    res.send(result);
};

router.post('/login', login);

export = router;

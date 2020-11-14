import {DbManager} from '../DbManager';
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {SysUser} from "../../entity/user/SysUser";
import {LoginRepCodeEnum} from "../../exception/LoginRepCodeEnum";


/**
 *
 *@since
 *@author
 *@date 2020/11/14 16:28
 */
export class SysUserRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): SysUserRepository {
        if (SysUserRepository.repository == null) {
            SysUserRepository.repository = new SysUserRepository();
        }
        return SysUserRepository.repository;
    }

    /**
     *  用户列表
     */
    async list(accountId, symbol, pageNo, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(SysUser);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');
        queryBuilder.where('1=1');
        countBuilder.where('1=1');

        pageNo   = PageNoAndPageSizeUtils.getCurrentPageNo(pageNo);
        pageSize = PageNoAndPageSizeUtils.getPageSize(pageSize);
        queryBuilder.take(pageSize);
        queryBuilder.skip(pageNo * pageSize);
        const result = await queryBuilder.getRawMany();
        let count = await countBuilder.getRawMany();
        for (let countKey of count) {
            count = countKey['count'];
        }
        return {
            result: result,
            currentPage: pageNo+1,
            count: Number(count)
        };
    }

    /**
     * 查看详情
     * @param id
     */
    async get(id) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userSearch = connection
            .getRepository(SysUser)
            .createQueryBuilder('user')
            .where('id = :id', {id: id});
        return await userSearch.getOne();
    }

    /**
     * 根据账号查询用户信息
     * @param username
     */
    async getUser(username) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        let repository      = connection.getRepository(SysUser);
        const queryBuilder  = await repository.createQueryBuilder();

        queryBuilder.where('username = :username', {username: username});
        return await queryBuilder.getOne();
    }

    /**
     *  新增
     */
    async add(user) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const userSearch    = connection
            .createQueryBuilder()
            .insert()
            .into(SysUser)
            .values([user])
            .execute();
    }

    /**
     *  更新
     */
    async update(user) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userSearch = connection
            .createQueryBuilder()
            .update(SysUser)
            .set(user)
            .where('id = :id', { id: user.id })
            .execute();
    }

    /**
     *  登录
     */
    async login(username, password) {
        let result = {
            code: null,
            data: null,
            userId: null,
            msg: null,
        }
        // 根据手用户名查询用户
        const user      = await this.getUser(username);
        if(!user){
            result.code = LoginRepCodeEnum.ERR_NOT_EXIST;
            result.msg  = '账号不存在';
            return result;
        }
        if(password.toLocaleLowerCase() !== user.password.toLocaleLowerCase()){
            result.code = LoginRepCodeEnum.ERR_PASSWORD;
            result.msg = '账号密码错误';
            return result;
        }
        result.code   = LoginRepCodeEnum.SUCCESS;
        result.data   = '';
        result.userId = user.id;
        result.msg    = '成功';
        return result;
    }

}

import {DbManager} from '../DbManager';
import {User} from "../../entity/user/User";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {ValidatorUtils} from "../../utils/ValidatorUtils";


/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class UserRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): UserRepository {
        if (UserRepository.repository == null) {
            UserRepository.repository = new UserRepository();
        }
        return UserRepository.repository;
    }

    /**
     *  用户列表
     */
    async list(accountId, symbol, pageNo, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(User);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');
        queryBuilder.where('1=1');
        countBuilder.where('1=1');

        if (ValidatorUtils.isNotEmpty(accountId)) {
            queryBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
            countBuilder.andWhere('accountId like :accountId', {accountId: accountId+"%"});
        }
        if (ValidatorUtils.isNotEmpty(symbol)) {
            queryBuilder.andWhere('symbol like :symbol', {symbol: "%"+symbol+"%"});
            countBuilder.andWhere('symbol like :symbol', {symbol: "%"+symbol+"%"});
        }
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
            .getRepository(User)
            .createQueryBuilder('user')
            .where('userId = :id', {id: id});
        return await userSearch.getOne();
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
            .into(User)
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
            .update(User)
            .set(user)
            .where('userId = :userId', { userId: user.userId })
            .execute();
    }

}

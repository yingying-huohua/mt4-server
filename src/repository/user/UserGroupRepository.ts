import {DbManager} from '../DbManager';
import {UserGroup} from "../../entity/user/UserGroup";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {ValidatorUtils} from "../../utils/ValidatorUtils";


/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class UserGroupRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): UserGroupRepository {
        if (UserGroupRepository.repository == null) {
            UserGroupRepository.repository = new UserGroupRepository();
        }
        return UserGroupRepository.repository;
    }

    /**
     *  用户组列表
     */
    async list(pageNo, type, status, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userGroupSearch = connection
            .getRepository(UserGroup)
            .createQueryBuilder('userGroup')
            .select('*');
        userGroupSearch.where('1=1');
        pageNo   = PageNoAndPageSizeUtils.getPageNo(pageNo);
        pageSize = PageNoAndPageSizeUtils.getPageSize(pageSize);
        userGroupSearch.take(pageSize);
        userGroupSearch.skip((pageNo - 1) * pageSize);
        const result = await userGroupSearch.getRawMany();
        return {
            result: result,
            currentPage: pageNo
        };
    }

    /**
     * 查看详情
     * @param id
     */
    async get(id) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userGroupSearch = connection
            .getRepository(UserGroup)
            .createQueryBuilder('userGroup')
            .where('userId = :id', {id: id});
        return await userGroupSearch.getOne();
    }

    /**
     *  新增
     */
    async add(userGroup) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const userGroupSearch    = connection
            .createQueryBuilder()
            .insert()
            .into(UserGroup)
            .values([userGroup])
            .execute();
    }

    /**
     *  更新
     */
    async update(userGroup) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userGroupSearch = connection
            .createQueryBuilder()
            .update(UserGroup)
            .set(userGroup)
            .where('id = :id', { id: userGroup.id })
            .execute();
    }

    /**
     *  组用户列表
     */
    async listUser(groupId, pageNo, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        let repository = connection.getRepository(UserGroup);
        const queryBuilder = await repository.createQueryBuilder();
        const countBuilder = await repository.createQueryBuilder();

        queryBuilder.select('*');
        countBuilder.select('count(*)', 'count');
        queryBuilder.where('1=1');
        countBuilder.where('1=1');

        if (ValidatorUtils.isNotEmpty(groupId)) {
            queryBuilder.andWhere('groupId = :groupId', {groupId: groupId});
            countBuilder.andWhere('groupId = :groupId', {groupId: groupId});
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

}

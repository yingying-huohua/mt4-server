import {DbManager} from '../DbManager';
import {Group} from "../../entity/user/Group";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";


/**
 *
 *@since
 *@author
 *@date 2020/10/9 16:28
 */
export class GroupRepository {
    private static repository;
    private constructor() {}
    public static getInstance(): GroupRepository {
        if (GroupRepository.repository == null) {
            GroupRepository.repository = new GroupRepository();
        }
        return GroupRepository.repository;
    }

    /**
     *  组列表
     */
    async list(pageNo, type, status, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const userGroupSearch = connection
            .getRepository(Group)
            .createQueryBuilder('grp')
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
            .getRepository(Group)
            .createQueryBuilder('grp')
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
            .into(Group)
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
            .update(Group)
            .set(userGroup)
            .where('id = :id', { id: userGroup.id })
            .execute();
    }

}

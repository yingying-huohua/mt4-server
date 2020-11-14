import {DbManager} from "../DbManager";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {ScheduleJob} from "../../entity/scheduleJob/ScheduleJob";

/**
 * 任务基本信息
 *
 */
export class ScheduleJobRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): ScheduleJobRepository {
        if (ScheduleJobRepository.repository == null) {
            ScheduleJobRepository.repository = new ScheduleJobRepository();
        }
        return ScheduleJobRepository.repository;
    }


    /**
     *  任务列表
     */
    async list(pageNo, type, status, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(ScheduleJob)
            .createQueryBuilder('schedule')
            .select('*');
        queryBuilder.where('1=1');
        pageNo   = PageNoAndPageSizeUtils.getPageNo(pageNo);
        pageSize = PageNoAndPageSizeUtils.getPageSize(pageSize);
        queryBuilder.take(pageSize);
        queryBuilder.skip((pageNo - 1) * pageSize);
        const result = await queryBuilder.getRawMany();
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
        const queryBuilder = connection
            .getRepository(ScheduleJob)
            .createQueryBuilder('schedule')
            .where('id = :id', {id: id});
        return await queryBuilder.getOne();
    }

    /**
     *  新增
     */
    async add(scheduleJob) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const insertResult  = connection
            .createQueryBuilder()
            .insert()
            .into(ScheduleJob)
            .values([scheduleJob])
            .execute();
    }

    /**
     *  更新
     */
    async update(scheduleJob) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const updateResult = connection
            .createQueryBuilder()
            .update(ScheduleJob)
            .set(scheduleJob)
            .where('id = :id', { id: scheduleJob.id })
            .execute();
    }

    ////////////////////////////////////////////////  任务  /////////////////////////////////////////////////////////////
    /**
     * 用户收益汇总任务
     */
    async runUserProfitTask(tradeDateStart, tradeDateEnd, type) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_user_profit('${tradeDateStart}', '${tradeDateEnd}', '${type}')`;
        const result = await connection.query(query)

        return  result;
    }

    /**
     * 组收益汇总任务
     */
    async runGroupProfitTask(tradeDateStart, tradeDateEnd, type) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_group_profit('${tradeDateStart}', '${tradeDateEnd}', '${type}')`;
        const result = await connection.query(query)

        return  result;
    }


    /**
     * 品种收益汇总任务
     */
    async runSymbolProfitTask(tradeDateStart, tradeDateEnd, type) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_symbol_profit('${tradeDateStart}', '${tradeDateEnd}', '${type}')`;
        const result = await connection.query(query)

        return  result;
    }

    /**
     * 品种meta信息统计
     */
    async runSymbolMetaTask(tradeDateStart, tradeDateEnd) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_symbol_meta('${tradeDateStart}', '${tradeDateEnd}')`;
        const result = await connection.query(query)

        return  result;
    }


    /**
     * 品种meta信息用户数更新
     */
    async runSymbolMetaUpdateTask(tradeDateStart, tradeDateEnd) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_symbol_meta_user_count()`;
        const result = await connection.query(query)

        return  result;
    }

    /**
     * 用户活跃统计
     */
    async runUserActiveTask(tradeDateStart, tradeDateEnd, type) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_user_active('${tradeDateStart}', '${tradeDateEnd}', '${type}')`;
        const result = await connection.query(query)

        return  result;
    }


    /**
     * 用户总收益统计
     */
    async runUserProfitTotalTask(tradeDateStart, tradeDateEnd) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL update_user_profit_total('${tradeDateStart}', '${tradeDateEnd}')`;
        const result = await connection.query(query)

        return  result;
    }


    /**
     * 增量导入用户
     */
    async runDeltaImportUserTask(tradeDateStart, tradeDateEnd) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL delta_import_user('${tradeDateStart}', '${tradeDateEnd}')`;
        const result = await connection.query(query)

        return  result;
    }

    /**
     * 增量导入品种
     */
    async runDeltaImportSymbolTask(tradeDateStart, tradeDateEnd) {
        const dbManager = await DbManager.getInstance();
        const connection = await dbManager.getConnection();

        // 调用存储过程
        let query = `CALL delta_import_symbol('${tradeDateStart}', '${tradeDateEnd}')`;
        const result = await connection.query(query)

        return  result;
    }



}

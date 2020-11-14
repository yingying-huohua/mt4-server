import {DbManager} from "../DbManager";
import {PageNoAndPageSizeUtils} from "../../utils/PageNoAndPageSizeUtils";
import {ScheduleJobLog} from "../../entity/scheduleJob/ScheduleJobLog";

/**
 * 任务日志Repo
 *
 */
export class ScheduleJobLogRepository {
    private static repository;

    private constructor() {
    }

    public static getInstance(): ScheduleJobLogRepository {
        if (ScheduleJobLogRepository.repository == null) {
            ScheduleJobLogRepository.repository = new ScheduleJobLogRepository();
        }
        return ScheduleJobLogRepository.repository;
    }


    /**
     *  任务日志列表
     */
    async list(pageNo, type, status, pageSize?) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const queryBuilder = connection
            .getRepository(ScheduleJobLog)
            .createQueryBuilder('scheduleLog')
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
            .getRepository(ScheduleJobLog)
            .createQueryBuilder('scheduleLog')
            .where('id = :id', {id: id});
        return  queryBuilder.getOne();
    }

    /**
     * 最近一次执行时间
     * @param jobId
     */
    async getByJobId(jobId) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();

        const queryBuilder    = connection
            .getRepository(ScheduleJobLog)
            .createQueryBuilder('scheduleLog')
            .select('max(scheduleLog.createTime)', 'lastRunTime')
            .where('scheduleLog.jobId = :jobId', {jobId: jobId});
        return await queryBuilder.getRawOne();
    }


    /**
     *  新增
     */
    async add(scheduleJobLog) {
        const dbManager     = await DbManager.getInstance();
        const connection    = await dbManager.getConnection();
        const insertResult  = connection
            .createQueryBuilder()
            .insert()
            .into(ScheduleJobLog)
            .values([scheduleJobLog])
            .execute();
    }

    /**
     *  更新
     */
    async update(scheduleJobLog) {
        const dbManager   = await DbManager.getInstance();
        const connection  = await dbManager.getConnection();
        const updateResult = connection
            .createQueryBuilder()
            .update(ScheduleJobLog)
            .set(scheduleJobLog)
            .where('id = :id', { id: scheduleJobLog.id })
            .execute();
    }


}

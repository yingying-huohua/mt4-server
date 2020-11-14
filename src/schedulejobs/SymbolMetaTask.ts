import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {DateUtil} from "../utils/DateUtil";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {Constant} from "../config/Constant";

/**
 * 品种meta信息统计
 */
export class SymbolMetaTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('SymbolMetaTask start...');
        // 获取上次执行时间
        const jobId        = 6;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);
        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());

        console.log('SymbolMetaTask lastRunDate :', lastRunDate);
        console.log('SymbolMetaTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '品种Meta信息统计';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程
        let result = await ScheduleJobRepository.getInstance().runSymbolMetaTask(lastRunDate, tradeDateEnd);

        console.log('SymbolMetaTask result :', result)
    }

    async doUpdateUserCountTask() {
        console.log('UpdateUserCountTask start...');
        // 获取上次执行时间
        const jobId        = 9;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);
        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());

        console.log('UpdateUserCountTask lastRunDate :', lastRunDate);
        console.log('UpdateUserCountTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '品种Meta信息更新';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程
        let result = await ScheduleJobRepository.getInstance().runSymbolMetaUpdateTask(lastRunDate, tradeDateEnd);

        console.log('UpdateUserCountTask result :', result)
    }

}

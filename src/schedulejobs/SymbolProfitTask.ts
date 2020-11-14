import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {DateUtil} from "../utils/DateUtil";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {Constant} from "../config/Constant";

/**
 * 品种收益汇总聚合任务： 按品种、按天统计品种盈亏用户占比
 */
export class SymbolProfitTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('SymbolProfitTask start...');
        // 获取上次执行时间
        const jobId        = 3;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);
        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());
        let type           = '外汇';

        console.log('SymbolProfitTask lastRunDate :', lastRunDate);
        console.log('SymbolProfitTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '品种收益汇总';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程
        let result = await ScheduleJobRepository.getInstance().runSymbolProfitTask(lastRunDate, tradeDateEnd, type);

        console.log('SymbolProfitTask result :', result)
    }
}

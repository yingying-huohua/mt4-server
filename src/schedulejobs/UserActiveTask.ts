import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {DateUtil} from "../utils/DateUtil";
import {UserProfitItemRepository} from "../repository/order/UserProfitItemRepository";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {Constant} from "../config/Constant";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";

/**
 * 活跃用户排名汇总统计任务： 按人按天统计活跃度（交易次数）， 交易次数排名
 */
export class UserActiveTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('UserActiveTask start...');
        // 获取上次执行时间
        const jobId        = 4;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);
        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());
        let type           = '外汇';

        console.log('UserActiveTask lastRunDate :', lastRunDate);
        console.log('UserActiveTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '用户活跃统计';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程
        let result = await ScheduleJobRepository.getInstance().runUserActiveTask(lastRunDate, tradeDateEnd, type);

        console.log('UserActiveTask result :', result)
    }

}

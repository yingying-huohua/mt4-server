import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {DateUtil} from "../utils/DateUtil";
import {Constant} from "../config/Constant";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";

/**
 * 用户最后收益统计： 按人统计最后收益
 */
export class UserProfitTotalTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('UserProfitTotalTask start...');
        // 获取上次执行时间
        const jobId        = 5;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);

        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());

        console.log('UserProfitTotalTask lastRunDate :', lastRunDate);
        console.log('UserProfitTotalTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '用户总收益统计';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程，执行汇总任务，更新用户收益
        let result = await ScheduleJobRepository.getInstance().runUserProfitTotalTask(lastRunDate, tradeDateEnd);

        console.log('UserProfitTotalTask result :', result)
    }

}

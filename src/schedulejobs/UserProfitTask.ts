import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {DateUtil} from "../utils/DateUtil";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {UserProfitItemRepository} from "../repository/order/UserProfitItemRepository";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {Constant} from "../config/Constant";

/**
 * 用户收益汇总聚合任务： 按天按品种统计用户收益
 */
export class UserProfitTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('UserProfitTask start...');
        // 获取上次执行时间
        const jobId        = 1;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);

        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());
        let type           = '外汇';

        console.log('UserProfitTask lastRunDate :', lastRunDate);
        console.log('UserProfitTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '用户收益统计';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程，执行汇总任务，更新用户收益
        let result = await ScheduleJobRepository.getInstance().runUserProfitTask(lastRunDate, tradeDateEnd, type);

        console.log('UserProfitTaskk result :', result)
    }


}

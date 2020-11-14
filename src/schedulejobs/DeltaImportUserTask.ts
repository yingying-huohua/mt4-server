import {BaseTask} from "./BaseTask";
import {ScheduleJobLogRepository} from "../repository/schedule/ScheduleJobLogRepository";
import {DateUtil} from "../utils/DateUtil";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {ScheduleJobRepository} from "../repository/schedule/ScheduleJobRepository";
import {ValidatorUtils} from "../utils/ValidatorUtils";
import {Constant} from "../config/Constant";

/**
 * 增量导入用户任务
 */
export class DeltaImportUserTask implements BaseTask{

    before(): void {}

    after(): void {}

    async doTask() {
        console.log('DeltaImportUserTask start...');
        // 获取上次执行时间
        const jobId        = 7;
        let lastRun        = await ScheduleJobLogRepository.getInstance().getByJobId(jobId);
        let lastRunDate;
        if(ValidatorUtils.isEmpty(lastRun) || ValidatorUtils.isEmpty(lastRun.lastRunTime)){
            lastRunDate    = DateUtil.parseDate(Constant.DEFAULT_TRADE_START);
        }else{
            lastRunDate    = DateUtil.parseDate(lastRun.lastRunTime);
        }
        let tradeDateEnd   = DateUtil.parseDate(DateUtil.getNow());
        let type           = '外汇';

        console.log('DeltaImportUserTask lastRunDate :', lastRunDate);
        console.log('DeltaImportUserTask tradeDateEnd :', tradeDateEnd);

        let scheduleJobLog = new ScheduleJobLog();
        scheduleJobLog.createTime = DateUtil.getNow()
        scheduleJobLog.jobId      = jobId;
        scheduleJobLog.name       = '增量导入用户';
        scheduleJobLog.status     = 0;

        await ScheduleJobLogRepository.getInstance().add(scheduleJobLog);
        // 调用存储过程
        let result = await ScheduleJobRepository.getInstance().runDeltaImportUserTask(lastRunDate, tradeDateEnd);

        console.log('DeltaImportUserTask result :', result)
    }
}

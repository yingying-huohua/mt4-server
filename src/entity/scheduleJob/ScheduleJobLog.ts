import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 任务日志信息
 */
@Entity('schedule_job_log')
export class ScheduleJobLog {

    @PrimaryGeneratedColumn()
    id: number;

    // 任务id
    @Column()
    jobId: number;

    // 任务名称
    @Column()
    name: string;

    // 参数
    @Column()
    params: string;

    // 任务状态    -1：  失败   1：成功
    @Column()
    status: number;

    // 处理信息：异常信息
    @Column()
    msg: string;

    // 耗时(单位：毫秒)
    @Column()
    times: number;

    // 创建时间(执行时间)
    @Column()
    createTime: Date;


}

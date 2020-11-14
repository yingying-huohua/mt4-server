import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 任务基本信息
 */
@Entity('schedule_job')
export class ScheduleJob {

    @PrimaryGeneratedColumn()
    id: number;

    // 任务名称
    @Column()
    name: string;

    // 参数
    @Column()
    params: string;

    // cron表达式
    @Column()
    cronExpression: string;

    // 任务状态 0：暂停  1：正常  -1：删除
    @Column()
    status: number;

    // 类型： 外汇  期货
    @Column()
    type: string;

    // 备注
    @Column()
    remark: string;

    // 创建时间
    @Column()
    createTime: Date;


}

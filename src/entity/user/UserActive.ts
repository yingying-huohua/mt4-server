import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 *  用户活跃：按用户、按天汇总统计交易次数
 */
@Entity('user_active')
export class UserActive {

    // id
    @PrimaryGeneratedColumn()
    id: number;

    // 用户id
    @Column()
    userId: number;

    // 账号
    @Column()
    accountId: number;

    // 交易次数
    @Column()
    tradeCount: string;

    // 交易日期
    @Column()
    tradeDate: Date;

    // 品种
    @Column()
    symbol: string;

    // 外汇 期货
    @Column()
    type: string;

}

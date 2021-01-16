import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 *  每个品种按天按账号汇总： 统计分析每个品种每天或者一段时间用户盈亏收益占比
 */
@Entity('fx_user_profit_item')
export class UserProfitItem {

    // id
    @PrimaryGeneratedColumn()
    id: number;

    // 用户id
    @Column()
    userId: number;

    // 账号
    @Column()
    accountId: number;

    // 品种
    @Column()
    standardSymbol: string;

    // 盈亏
    @Column()
    profit: string;

    // 收益率
    @Column()
    returnRate: string;

    // 外汇 期货
    @Column()
    type: string;

}

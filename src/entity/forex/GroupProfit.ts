import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 用户组收益
 */
@Entity('fx_group_profit')
export class GroupProfit {

    // id
    @PrimaryGeneratedColumn()
    id: number;

    // 组id
    @Column()
    groupId: string;

    // 组名称
    @Column()
    groupName: string;

    // 盈亏金额
    @Column()
    profit: number;

    // 收益率
    @Column()
    returnRate: string;

    // 总人数
    @Column()
    userCount: number;

    // 开仓时间
    @Column()
    tradeDate: Date;

    // 外汇 期货
    @Column()
    type: string;

}

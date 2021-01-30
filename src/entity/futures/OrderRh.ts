import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 期货成交记录
 */
@Entity('order_rh')
export class OrderRh {

    @PrimaryColumn({name: 'id'})
    id: number;

    // 投资者账户
    @Column({name: 'investor_id'})
    investorId: string;

    // 成交编号
    @Column({name: 'order_sys_id'})
    orderSysId: string;

    // 投资者账户类型
    @Column({name: 'investor_type'})
    investorType: number;

    // 合约
    @Column({name: 'instrument_id'})
    instrumentId: string;

    // 成交量
    @Column({name: 'traded_volume'})
    tradedVolume: number;

    // 多空标识（0-多单，1-空单）
    @Column({name: 'direction'})
    direction: string;

    // 开平标识
    @Column({name: 'open_close_flag'})
    openCloseFlag: string;

    // 成交价
    @Column({name: 'price'})
    price: string;

    // 成交日期
    @Column({name: 'order_date'})
    orderDate: string;

    // 成交时间
    @Column({name: 'order_time'})
    orderTime: string;

    // 成交时间
    @Column({name: 'trade_time'})
    tradeTime: string;

    // 创建时间
    @Column({name: 'create_time'})
    createTime: string;

    // 开仓均价
    @Column({name: 'open_avg_price'})
    openAvgPrice: string;

    // 盈亏
    @Column({name: 'profit'})
    profit: string;

    // 计算盈亏标识
    @Column({name: 'calc_flag'})
    calcFlag: number;

    // 监控账户
    @Column({name: 'monitor_account'})
    monitorAccount: string;

}

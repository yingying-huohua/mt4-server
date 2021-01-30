import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 实时持仓
 */
@Entity('position')
export class Position {

    // 投资者代码
    @PrimaryColumn({name: 'investor_id'})
    investorId: string;

    // 经纪公司代码
    @Column({name: 'broker_Id'})
    brokerId: string;

    // 产品代码
    @Column({name: 'product_id'})
    productId: string;

    // 合约代码
    @PrimaryColumn({name: 'instrument_id'})
    instrumentId: string;

    // 投机套保标志
    @Column({name: 'hedge_flag'})
    hedgeFlag: string;

    // 持仓方向
    @PrimaryColumn({name: 'direction'})
    direction: string;

    // 持仓数量
    @Column({name: 'volume'})
    volume: string;

    // 持仓保证金
    @Column({name: 'margin'})
    margin: string;

    // 逐笔开仓均价
    @Column({name: 'avg_open_price_by_vol'})
    avgOpenPriceByVol: string;

    // 逐日开仓均价
    @Column({name: 'avg_open_price'})
    avgOpenPrice: string;

    // 今仓数量
    @Column({name: 'today_volume'})
    todayVolume: string;

    // 冻结持仓数量
    @Column({name: 'frozen_volume'})
    frozenVolume: string;

    // 信息类型
    @Column({name: 'entry_type'})
    entryType: string;

    // 0-资金账户,1-操作账户
    @Column({name: 'investor_type'})
    investorType: string;

    // 所属监控账号
    @Column({name: 'monitor_account'})
    monitorAccount: string;

    @Column({name: 'create_time'})
    createTime: string;

    @Column({name: 'update_time'})
    updateTime: string;

}

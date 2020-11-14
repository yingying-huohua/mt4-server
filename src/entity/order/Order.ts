import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('user_order')
export class Order {
    // 账号
    @PrimaryColumn()
    accountId: number;

    // 订单唯一id
    @PrimaryColumn()
    ticket: number;

    // id
    @Column()
    userId: number;

    // 开仓时间
    @Column()
    openTime: string;

    // 平仓时间
    @Column()
    closeTime: string;

    @Column()
    diffTime: number;

    // 方向（0-买，1-卖）
    @Column()
    type: number;

    // 成交量
    @Column()
    lots: string;

    // 品种代号
    @Column({length:10})
    symbol: string;

    // 品种代号
    @Column({length:10})
    standardSymbol: string;

    // 开仓价
    @Column()
    openPrice: string;

    // 平仓价
    @Column()
    closePrice: string;

    @Column()
    stopLoss: string;

    @Column()
    takeProfit: string;

    @Column()
    magicNumber: number;

    // 隔夜利息
    @Column()
    swap: string;

    // 手续费
    @Column()
    commission: string;

    // 备注
    @Column()
    comment: string;

    // 盈亏
    @Column()
    profit: string;

    @Column()
    rateOpen: string;

    @Column()
    rateClose: string;

    @Column()
    rateMargin: string;

}

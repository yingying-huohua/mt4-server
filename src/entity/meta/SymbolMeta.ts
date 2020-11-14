import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 品种概要信息
 */
@Entity('symbol_meta')
export class SymbolMeta {
    @PrimaryColumn()
    id: number;

    // 品种名称
    @Column({length:20})
    name: string;

    // 品种
    @Column({length:20})
    symbol: string;

    // 品种总人数
    @Column()
    userCount: number;

    // 总盈亏（金额）
    @Column()
    totalProfit: number;

    // 盈利（人数占比）
    @Column()
    profitRate: string;

    // 亏损（人数占比）
    @Column()
    lossRate: string;

    // 持平（人数占比）
    @Column()
    breakEvenRate: string;

    // 盈利（人数）
    @Column()
    profitUserCount: number;

    // 亏损（人数）
    @Column()
    lossUserCount: number;

    // 持平（人数）
    @Column()
    breakEvenUserCount: number;

    // 盈利金额
    @Column()
    profitMoney: number;

    // 亏损金额
    @Column()
    lossMoney: number;

}

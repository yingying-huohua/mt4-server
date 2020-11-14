import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 品种收益占比汇总
 */
@Entity('symbol_profit')
export class SymbolProfit {

    // id
    @PrimaryGeneratedColumn()
    id: number;

    // 品种
    @Column()
    standardSymbol: string;

    // 收益
    @Column()
    profit: string;

    // 亏损
    @Column()
    loss: string;

    // 持平
    @Column()
    breakEven: string;

    // 交易时间
    @Column()
    tradeDate: string;

    // 外汇 期货
    @Column()
    type: string;

}

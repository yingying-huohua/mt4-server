import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 品种
 */
@Entity('symbol')
export class Symbol {
    @PrimaryColumn()
    id: number;

    // 品种名称
    @Column({length:20})
    name: string;

    // 品种代号
    @Column({length:10})
    symbol: string;

    // 品种代号
    @Column({length:10})
    standardSymbol: string;

    // 品种类型(外汇、 期货)
    @Column({length:10})
    type: string;

    // 接口（第三方）地址
    @Column({length:100})
    api: string;

    // 品种描述
    @Column({length:200})
    description: string;

}

import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 概要信息
 */
@Entity('meta')
export class Meta {
    @PrimaryColumn()
    id: number;

    // 总盈利
    @Column({length:20})
    totalProfit: string;

    // 总人数
    @Column()
    userCount: number;

    // 总品种数
    @Column()
    symbolCount: number;

}

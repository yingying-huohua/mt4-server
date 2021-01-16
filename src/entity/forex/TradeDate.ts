import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

/**
 *
 */
@Entity('tradedate')
export class TradeDate {
    @PrimaryGeneratedColumn()
    id: number;

    // 交易开始时间
    @Column()
    startDate: Date;

    // 交易截止时间
    @Column()
    endDate: Date;

    // 间隔天数
    @Column()
    interval: number;

    // 描述
    @Column()
    description: string;


}

import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 用户总收益汇总表： 区分品种和类型
 */
@Entity('user_profit_total')
export class UserProfitTotal {

    // id
    @PrimaryGeneratedColumn()
    id: number;

    // 账号
    @Column()
    accountId: number;

    // 用户id
    @Column()
    userId: number;

    // 收益
    @Column()
    profit: string;

    // 品种
    @Column()
    symbol: string;

    // 类型
    @Column()
    type: string;

}

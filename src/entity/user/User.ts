import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 用户信息
 */
@Entity('user')
export class User {

    // 用户id
    @PrimaryColumn()
    userId: number;

    // 账号
    @PrimaryColumn()
    accountId: number;

    // 品种代号（逗号分隔）
    @Column({length:100})
    symbol: string;

    // 品种代号（逗号分隔）
    @Column({length:100})
    standardSymbol: string;

}

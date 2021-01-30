import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 客户资金信息
 */
@Entity('trading_account')
export class TradingAccount {

    // 投资者代码
    @PrimaryColumn({name: 'account_id'})
    accountId: string;

    // 经纪公司代码
    @Column({name: 'broker_id'})
    brokerId: string

    // 上次质押金额
    @Column({name: 'pre_mortgage'})
    preMortgage: string

    // 上次信用额度
    @Column({name: 'pre_credit'})
    preCredit: string

    // 上次存款额
    @Column({name: 'pre_deposit'})
    preDeposit: string

    // 上次结算准备金
    @Column({name: 'pre_balance'})
    preBalance: string

    // 上次占用的保证金
    @Column({name: 'pre_margin'})
    preMargin: string

}

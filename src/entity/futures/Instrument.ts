import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 合约信息
 */
@Entity('ctp_instrument')
export class Instrument {

    // 合约代码
    @PrimaryColumn({name: 'instrument_id'})
    instrumentId: string;

    // 交易所代码
    @PrimaryColumn({name: 'exchange_id'})
    exchangeId: string;

    // 合约名称
    @Column({name: 'instrument_name'})
    instrumentName: string;

    // 合约在交易所的代码
    @Column({name: 'exchange_inst_id'})
    exchangeInstId: string;

    // 产品代码
    @PrimaryColumn({name: 'product_id'})
    productId: string;

    // 产品类型
    @Column({name: 'product_class'})
    productClass: string;

    // 交割年份
    @Column({name: 'delivery_year'})
    deliveryYear: string;

    // 交割月
    @Column({name: 'delivery_month'})
    deliveryMonth: string;

    // 市价单最大下单量
    @Column({name: 'max_market_order_volume'})
    maxMarketOrderVolume: string;

    // 市价单最小下单量
    @Column({name: 'min_market_order_volume'})
    minMarketOrderVolume: string;

    // 限价单最大下单量
    @Column({name: 'max_limit_order_volume'})
    maxLimitOrderVolume: string;

    // 限价单最小下单量
    @Column({name: 'min_limit_order_volume'})
    minLimitOrderVolume: string;

    // 合约数量乘数
    @Column({name: 'volume_multiple'})
    volumeMultiple: string;

    // 最小变动价位
    @Column({name: 'price_tick'})
    priceTick: string;

    // 创建日
    @Column({name: 'create_date'})
    createDate: string;

    // 上市日
    @Column({name: 'open_date'})
    openDate: string;

    // 到期日
    @Column({name: 'expire_date'})
    expireDate: string;

    // 开始交割日
    @Column({name: 'start_deliv_date'})
    startDelivDate: string;

    // 结束交割日
    @Column({name: 'end_deliv_date'})
    endDelivDate: string;

    // 合约生命周期状态
    @Column({name: 'inst_life_phase'})
    instLifePhase: string;

    // 当前是否交易
    @Column({name: 'is_trading'})
    isTrading: string;

    // 持仓类型
    @Column({name: 'position_type'})
    positionType: string;

    // 持仓日期类型
    @Column({name: 'position_date_type'})
    positionDateType: string;

    // 多头保证金率
    @Column({name: 'long_margin_ratio'})
    longMarginRatio: string;

    // 空头保证金率
    @Column({name: 'short_margin_ratio'})
    shortMarginRatio: string;

    // 是否使用大额单边保证金算法
    @Column({name: 'max_margin_side_algorithm'})
    maxMarginSideAlgorithm: string;

    // 基础商品代码
    @Column({name: 'underlying_instr_id'})
    underlyingInstrId: string;

    // 执行价
    @Column({name: 'strike_price'})
    strikePrice: string;

    // 期权类型
    @Column({name: 'options_type'})
    optionsType: string;

    // 合约基础商品乘数
    @Column({name: 'underlying_multiple'})
    underlyingMultiple: string;

    // 组合类型
    @Column({name: 'combination_type'})
    combinationType: string;

    @Column({name: 'is_subscribe'})
    isSubscribe: string;

    // 记录创建时间
    @Column({name: 'create_time'})
    createTime: string;

}

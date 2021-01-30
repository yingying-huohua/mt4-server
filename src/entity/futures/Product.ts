import {Column, Entity, PrimaryColumn} from 'typeorm';

/**
 * 期货产品
 */
@Entity('ctp_product')
export class Product {

    // 产品代码
    @PrimaryColumn({name: 'product_id'})
    productId: string;

    // 产品名称
    @Column({name: 'product_name'})
    productName: string;

    // 交易所代码
    @PrimaryColumn({name: 'exchange_id'})
    exchangeId: string;

    // 产品类型
    @Column({name: 'product_class'})
    productClass: string;

}

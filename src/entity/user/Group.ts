import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 用户分组
 */
@Entity('groups')
export class Group {

    @PrimaryGeneratedColumn()
    id: string;

    // 组名称
    @Column({length:20})
    name: string;

    // 组简称
    @PrimaryColumn()
    abbr: string;

    // // 品种代号（逗号分隔）
    // @Column({length:100})
    // symbol: string;

    // 品种代号（逗号分隔）
    @Column({length:100})
    standard_Symbol: string;

    // 人数
    @Column()
    userCount: number;

    // 描述
    @Column({length:200})
    description: string;

}

import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * 系统用户信息表
 */
@Entity('sys_user')
export class SysUser {

    // 用户id
    @PrimaryGeneratedColumn()
    id: number;

    // 名称
    @Column()
    username: string;

    // 密码
    @Column()
    password: string;

    // 手机号码
    @Column()
    phone: string;

    // 盐值
    @Column()
    salt: string;

}

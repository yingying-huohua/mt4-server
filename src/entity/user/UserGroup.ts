import {Entity, PrimaryColumn} from 'typeorm';

/**
 * 用户组关系
 */
@Entity('user_group')
export class UserGroup {

    // 组id
    @PrimaryColumn()
    groupId: string;

    // 组名称
    @PrimaryColumn()
    groupName: string;

    // 组简称
    @PrimaryColumn()
    groupAbbr: string;

    // 账号
    @PrimaryColumn()
    accountId: number;

    // 用户id
    @PrimaryColumn()
    userId: number;

}

import {ConnectionOptions} from 'd';

import {Order} from '../entity/order/Order';
import {User} from "../entity/user/User";
import {Symbol} from "../entity/order/Symbol";
import {Group} from "../entity/user/Group";
import {UserGroup} from "../entity/user/UserGroup";
import {TradeDate} from "../entity/order/TradeDate";
import {UserProfitItem} from "../entity/order/UserProfitItem";
import {UserProfitTotal} from "../entity/order/UserProfitTotal";
import {SymbolProfit} from "../entity/order/SymbolProfit";
import {GroupProfit} from "../entity/order/GroupProfit";
import {Meta} from "../entity/meta/Meta";
import {SymbolMeta} from "../entity/meta/SymbolMeta";
import {UserActive} from "../entity/user/UserActive";
import {ScheduleJob} from "../entity/scheduleJob/ScheduleJob";
import {ScheduleJobLog} from "../entity/scheduleJob/ScheduleJobLog";
import {environment} from "../environment/environment";
import {SysUser} from "../entity/user/SysUser";

export class DBConfig {
    constructor() {
    }
    static options: ConnectionOptions = {
        type: 'mysql',
        host: environment.dbhost,
        port: environment.dbport,
        username: environment.dbusername,
        password: environment.dbpassword,
        database: environment.database,
        synchronize: false, //是否同步schema
        logging: false,
        entities: [
            Order,
            User,
            Group,
            UserGroup,
            Symbol,
            TradeDate,
            UserProfitTotal,
            UserProfitItem,
            SymbolProfit,
            GroupProfit,
            Meta,
            SymbolMeta,
            UserActive,
            ScheduleJob,
            ScheduleJobLog,
            SysUser
        ],
    };
}

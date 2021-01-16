import {ConnectionOptions} from 'd';

import {Order} from '../entity/forex/Order';
import {User} from "../entity/user/User";
import {Symbol} from "../entity/forex/Symbol";
import {Group} from "../entity/user/Group";
import {UserGroup} from "../entity/user/UserGroup";
import {TradeDate} from "../entity/forex/TradeDate";
import {UserProfitItem} from "../entity/forex/UserProfitItem";
import {UserProfitTotal} from "../entity/forex/UserProfitTotal";
import {SymbolProfit} from "../entity/forex/SymbolProfit";
import {GroupProfit} from "../entity/forex/GroupProfit";
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

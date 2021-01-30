import {ConnectionOptions} from 'd';

import {Order} from '../entity/forex/Order';
import {User} from '../entity/user/User';
import {Symbol} from '../entity/forex/Symbol';
import {Group} from '../entity/user/Group';
import {UserGroup} from '../entity/user/UserGroup';
import {TradeDate} from '../entity/forex/TradeDate';
import {UserProfitItem} from '../entity/forex/UserProfitItem';
import {UserProfitTotal} from '../entity/forex/UserProfitTotal';
import {SymbolProfit} from '../entity/forex/SymbolProfit';
import {GroupProfit} from '../entity/forex/GroupProfit';
import {Meta} from '../entity/meta/Meta';
import {SymbolMeta} from '../entity/meta/SymbolMeta';
import {UserActive} from '../entity/user/UserActive';
import {ScheduleJob} from '../entity/scheduleJob/ScheduleJob';
import {ScheduleJobLog} from '../entity/scheduleJob/ScheduleJobLog';
import {environment} from '../environment/environment';
import {SysUser} from '../entity/user/SysUser';
import {OrderRh} from '../entity/futures/OrderRh';
import {Instrument} from '../entity/futures/Instrument';
import {Position} from '../entity/futures/Position';
import {Product} from '../entity/futures/Product';
import {TradingAccount} from '../entity/futures/TradingAccount';

export class DBConfig {
    constructor() {
    }
    // 外汇
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

    // 期货
    static futuresOptions: ConnectionOptions = {
        type: 'mysql',
        host: environment.fu_dbhost,
        port: environment.fu_dbport,
        username: environment.fu_dbusername,
        password: environment.fu_dbpassword,
        database: environment.fu_database,
        synchronize: false, //是否同步schema
        logging: false,
        entities: [
            OrderRh,
            Instrument,
            Position,
            Product,
            TradingAccount
        ],
    }
}

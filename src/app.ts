import express from 'express';
import morgan from 'morgan';
import lessMiddleware from 'less-middleware';

import order from './routes/order/Order';
import symbol from './routes/order/symbol';
import tradeDate from './routes/order/TradeDate';
import user from './routes/user/user';
import group from './routes/user/group';
import symbolIndex from './routes/dashboard/SymbolIndex';
import forexIndex from './routes/dashboard/ForexIndex';
import futuresIndex from './routes/dashboard/FuturesIndex';
import auth from './routes/auth/Auth';

// 期货
import product from './routes/futures/Product';
import tradingAccount from './routes/futures/TradingAccount';
import instrument from './routes/futures/Instrument';
import orderRh from './routes/futures/OrderRh';
import position from './routes/futures/Position';




// @ts-ignore
import swaggerDocument from '../swagger.json';
import fs from 'fs';
import path from 'path';
import {environment} from './environment/environment';
import {UserProfitTotalTask} from "./schedulejobs/UserProfitTotalTask";
import {GroupProfitTask} from "./schedulejobs/GroupProfitTask";
import {SymbolProfitTask} from "./schedulejobs/SymbolProfitTask";
import {UserActiveTask} from "./schedulejobs/UserActiveTask";
import {SymbolMetaTask} from "./schedulejobs/SymbolMetaTask";
import {UserProfitTask} from "./schedulejobs/UserProfitTask";
import {DeltaImportUserTask} from "./schedulejobs/DeltaImportUserTask";
import {DeltaImportSymbolTask} from "./schedulejobs/DeltaImportSymbolTask";

require('events').EventEmitter.defaultMaxListeners = 0;

const app  = express();
const swaggerUi         = require('swagger-ui-express');
const FileStreamRotator = require('file-stream-rotator');
const cookieParser = require('cookie-parser');

const root = require('app-root-path');

const schedule = require('node-schedule');

// 渲染引擎设置， ejs引擎
app.set('views', `${root}/src/views/`);
app.set('view engine', 'ejs');

// 日志相关
const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));
// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(`${root}/public`));
app.use(express.static(`${root}/public`));

// 允许跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('X-Powered-By', ' 3.2.1');
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(cookieParser());

//添加模块路由 swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// auth
app.use('/user/auth',   auth);

app.use('/order',       order);
app.use('/user',        user);
app.use('/user/group',  group);
app.use('/symbol',      symbol);
app.use('/tradedate',   tradeDate);

// 看板路由定义
app.use('/dashboard/symbol',        symbolIndex);   // 品种看板
app.use('/dashboard/forexIndex',    forexIndex);    // 外汇看板（品种总看板）
app.use('/dashboard/futuresIndex',  futuresIndex);  // 期货看板

// 期货
app.use('/futures/product',  product);                 // 产品
app.use('/futures/tradingAccount',  tradingAccount);   // 账号
app.use('/futures/instrument',  instrument);           // 合约
app.use('/futures/orderRh',  orderRh);                 // 订单
app.use('/futures/position',  position);               // 持仓


console.log('**********' + `${environment.environment}初始化完成` + '**************');

console.log('********** scheduleJob start **************');

// step 1: 用户收益汇总
// schedule.scheduleJob('0 */1 * * * ?', function () {
//     new UserProfitTask().doTask();
// });
//
// // 用户总收益汇总
// schedule.scheduleJob('0 */2 * * * ?', function () {
//     new UserProfitTotalTask().doTask();
// });
//
// // 用户组收益汇总
// schedule.scheduleJob('0 */3 * * * ?', function () {
//     new GroupProfitTask().doTask();
// });
//
// // 用户活跃度统计汇总
// schedule.scheduleJob('0 */3 * * * ?', function () {
//     new UserActiveTask().doTask();
// });
//
// // 品种收益汇总
// schedule.scheduleJob('0 */3 * * * ?', function () {
//     new SymbolProfitTask().doTask();
// });
//
// // 品种meta信息统计
// schedule.scheduleJob('0 */2 * * * ?', function () {
//     new SymbolMetaTask().doTask();
// });
//
// // 品种meta信息更新
// schedule.scheduleJob('0 */5 * * * ?', function () {
//     new SymbolMetaTask().doUpdateUserCountTask();
// });
//
// // 增量导入用户
// schedule.scheduleJob('0 */5 * * * ?', function () {
//     new DeltaImportUserTask().doTask();
// });
//
// // 增量导入品种
// schedule.scheduleJob('0 */5 * * * ?', function () {
//     new DeltaImportSymbolTask().doTask();
// });

export = app;

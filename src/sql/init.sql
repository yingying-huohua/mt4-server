-- 基本信息表
-- 品种表
CREATE TABLE `fx_symbol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '名称',
  `symbol` varchar(10) DEFAULT NULL COMMENT '简称',
  `standardSymbol` varchar(10) DEFAULT NULL COMMENT '标准',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `type` varchar(20) DEFAULT NULL COMMENT '品种类型',
  `api` varchar(100) DEFAULT NULL COMMENT '接口',
  PRIMARY KEY (`id`),
  KEY `idx_fx_symbol_symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化品种：订单表中所有品种
INSERT into fx_symbol (symbol, standardSymbol, type)
SELECT symbol, standardSymbol, '外汇' from fx_user_order GROUP BY symbol;

-- 增量更新品种：临时表
CREATE TABLE `fx_symbol_delta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '名称',
  `symbol` varchar(10) DEFAULT NULL COMMENT '简称',
  `standardSymbol` varchar(10) DEFAULT NULL COMMENT '标准',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `type` varchar(20) DEFAULT NULL COMMENT '品种类型',
  `api` varchar(100) DEFAULT NULL COMMENT '接口',
  PRIMARY KEY (`id`),
  KEY `idx_fx_symbol_delta_symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 用户表
CREATE TABLE `fx_user` (
  `userId` int(11) NOT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  PRIMARY KEY (`userId`),
  KEY `idx_fx_user_accountId` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化user：订单表中所有用户
INSERT into `fx_user` (userId, accountId)
SELECT userId, accountId from fx_user_order GROUP BY accountId;

-- 用户增量更新临时表
CREATE TABLE `fx_user_delta` (
  `userId` int(11) NOT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  PRIMARY KEY (`userId`),
  KEY `idx_fx_user_accountId` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化组
CREATE TABLE `fx_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '组名称',
  `abbr` varchar(255) DEFAULT NULL COMMENT '简称',
  `standardSymbol` varchar(100) DEFAULT NULL COMMENT '品种',
  `userCount` int(11) DEFAULT NULL COMMENT '组用户总数',
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `fx_groups` VALUES ('1', '超级牛散', 'superNB', 'XAUUSD,GBPJPY', '100', '都是牛B的散户');
INSERT INTO `fx_groups` VALUES ('2', '测试组1', '测试组1',  'XAUUSD,GBPJPY', '50', '测试组1');
INSERT INTO `fx_groups` VALUES ('3', '测试组2', '测试组2', 'XAUUSD,GBPJPY', '50', '测试组2');


-- 初始化组成员（随机生成测试）
CREATE TABLE `fx_user_group` (
  `groupId` int(11) NOT NULL COMMENT '组id',
  `accountId` int(11) NOT NULL COMMENT '账号id',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `groupName` varchar(50) DEFAULT NULL COMMENT '组名称',
  `groupAbbr` varchar(20) DEFAULT NULL COMMENT '组简称',
  PRIMARY KEY (`accountId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 INSERT INTO fx_user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '1', accountId, userId, '超级牛散', 'superNB' from `fx_user` ORDER BY RAND() limit 100;
 INSERT INTO fx_user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '2', accountId, userId, '测试组1', '测试组1' from `fx_user` ORDER BY RAND() limit 50;
 INSERT INTO fx_user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '3', accountId, userId, '测试组2', '测试组2' from `fx_user` ORDER BY RAND() limit 30;

CREATE TABLE `schedule_job` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务id',
  `name` varchar(200) DEFAULT NULL COMMENT '任务名称',
  `params` varchar(2000) DEFAULT NULL COMMENT '参数',
  `cronExpression` varchar(100) DEFAULT NULL COMMENT 'cron表达式',
  `status` tinyint(4) DEFAULT NULL COMMENT '任务状态 0：正常  1：暂停',
  `type` varchar(10) DEFAULT NULL COMMENT '类型： 外汇  期货',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务';

INSERT INTO `schedule_job` VALUES ('1', '用户收益汇总', null, null, '1', '外汇', null, '2020-11-07 15:12:11');
INSERT INTO `schedule_job` VALUES ('2', '组收益汇总', null, null, '1', '外汇', null, '2020-11-07 15:12:14');
INSERT INTO `schedule_job` VALUES ('3', '品种收益汇总', null, null, '1', '外汇', null, '2020-11-07 15:12:16');
INSERT INTO `schedule_job` VALUES ('4', '用户活跃统计', null, null, '1', '外汇', null, '2020-11-07 15:12:18');
INSERT INTO `schedule_job` VALUES ('5', '用户总收益统计', null, null, '1', '外汇', null, '2020-11-07 15:12:21');
INSERT INTO `schedule_job` VALUES ('6', '品种meta信息统计', null, null, '1', '外汇', null, '2020-11-07 15:12:24');
INSERT INTO `schedule_job` VALUES ('7', '增量更新品种', null, null, '1', '外汇', null, '2020-11-07 15:12:24');
INSERT INTO `schedule_job` VALUES ('8', '增量更新用户', null, null, '1', '外汇', null, '2020-11-07 15:12:24');
INSERT INTO `schedule_job` VALUES ('9', '更新品种meta信息', null, null, '1', '外汇', null, '2020-11-07 15:13:24');

CREATE TABLE `schedule_job_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务日志id',
  `jobId` bigint(20) NOT NULL COMMENT '任务id',
  `name` varchar(200) DEFAULT NULL COMMENT '任务名称',
  `params` varchar(2000) DEFAULT NULL COMMENT '参数',
  `status` tinyint(4) NOT NULL COMMENT '任务状态    0：成功    1：失败',
  `msg` varchar(2000) DEFAULT NULL COMMENT '处理信息：异常信息',
  `times` int(11) NOT NULL DEFAULT '0' COMMENT '耗时(单位：毫秒)',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间(执行时间)',
  PRIMARY KEY (`id`),
  KEY `jobId` (`jobId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务日志';

CREATE TABLE `tradedate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startDate` date DEFAULT NULL COMMENT '开始日期',
  `endDate` date DEFAULT NULL COMMENT '结束日期',
  `interval` int(11) DEFAULT NULL COMMENT '间隔',
  `type` varchar(20) DEFAULT NULL COMMENT '类型（外汇、期货）',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- 汇总统计表
CREATE TABLE `fx_user_profit_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) DEFAULT NULL COMMENT '账号',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `standardSymbol` varchar(50) DEFAULT NULL COMMENT '品种',
  `profit` decimal(16,6) DEFAULT NULL COMMENT '收益',
  `returnRate` float DEFAULT NULL COMMENT '收益率',
  `tradeDate` date DEFAULT NULL COMMENT '交易日期',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易笔数',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_fx_user_profit_item_accountId` (`accountId`),
  KEY `idx_fx_user_profit_item_symbol` (`standardSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `fx_user_profit_total` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `accountId` int(11) DEFAULT NULL,
  `profit` decimal(16,6) DEFAULT NULL COMMENT '收益',
  `standardSymbol` varchar(50) DEFAULT NULL COMMENT '品种',
  `type` varchar(10) DEFAULT NULL COMMENT '类型：期货、外汇',
  PRIMARY KEY (`id`),
  KEY `idx_fx_user_profit_total_accountId` (`accountId`),
  KEY `idx_fx_user_profit_total_symbol` (`standardSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO fx_user_profit_total(userId, accountId, standardSymbol, profit, type)
select userId, accountId, standardSymbol, 0 , '外汇' from `fx_user_order` where standardSymbol != '' GROUP BY accountId, standardSymbol;


CREATE TABLE `fx_user_active` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易次数',
  `tradeDate` date DEFAULT NULL COMMENT '交易日期',
  `standardSymbol` varchar(30) DEFAULT NULL COMMENT '品种',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_fx_user_active_accountId` (`accountId`),
  KEY `idx_fx_user_active_tradeDate` (`tradeDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `fx_group_profit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(20) DEFAULT NULL COMMENT '用户组id',
  `groupName` varchar(50) DEFAULT NULL COMMENT '用户组名称',
  `groupAbbr` varchar(20) DEFAULT NULL,
  `profit` decimal(16,6) DEFAULT NULL COMMENT '盈亏金额',
  `returnRate` float DEFAULT NULL COMMENT '收益率',
  `userCount` int(11) DEFAULT NULL COMMENT '群总人数',
  `tradeDate` date DEFAULT NULL COMMENT '交易日期',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_fx_group_profit_groupId` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `fx_symbol_profit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `standardSymbol` varchar(20) DEFAULT NULL COMMENT '品种',
  `tradeDate` date DEFAULT NULL,
  `profit` float DEFAULT NULL COMMENT '盈利',
  `loss` float DEFAULT NULL COMMENT '亏损',
  `breakEven` float DEFAULT NULL COMMENT '持平',
  `userCount` int(11) DEFAULT NULL COMMENT '交易人数',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易次数',
  `tradeMoney` decimal(16,6) DEFAULT NULL COMMENT '交易量',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_fx_symbol_profit_symbol` (`standardSymbol`),
  KEY `idx_fx_symbol_profit_tradeDate` (`tradeDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `fx_symbol_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '品种名称',
  `standardSymbol` varchar(20) DEFAULT NULL COMMENT '品种',
  `userCount` int(11) DEFAULT NULL COMMENT '品种总人数',
  `totalProfit` decimal(16,6) DEFAULT NULL COMMENT '品种总盈亏',
  `profitRate` float DEFAULT NULL COMMENT '盈利占比',
  `lossRate` float DEFAULT NULL COMMENT '亏损占比',
  `breakEvenRate` float DEFAULT NULL COMMENT '持平占比',
  `profitUserCount` int(11) DEFAULT NULL COMMENT '盈利人数',
  `lossUserCount` int(11) DEFAULT NULL COMMENT '亏损人数',
  `breakEvenUserCount` int(11) DEFAULT NULL COMMENT '持平人数',
  `profitMoney` decimal(16,6) DEFAULT NULL COMMENT '盈利总金额',
  `lossMoney` decimal(16,6) DEFAULT NULL COMMENT '亏损总金额',
  PRIMARY KEY (`id`),
  KEY `idx_fx_symbol_meta` (`standardSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 单品种汇总统计初始化
INSERT INTO fx_symbol_meta (`name`, `standardSymbol`, `totalProfit`, `profitRate`, `lossRate`, `breakEvenRate`, `profitMoney`, `lossMoney`, `userCount`, `profitUserCount`,`lossUserCount`,`breakEvenUserCount`)
SELECT `name`, standardSymbol, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 from fx_symbol group by standardSymbol;

-- 品种总汇总统计初始化： x代表总品种类型
INSERT INTO fx_symbol_meta (`name`, `standardSymbol`, `totalProfit`, `profitRate`, `lossRate`, `breakEvenRate`, `profitMoney`, `lossMoney`, `userCount`, `profitUserCount`,`lossUserCount`,`breakEvenUserCount`)
VALUES ('x', 'x', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- add index
-- alter table fx_user_order add index idx_fx_user_order_accountId(`accountId`);
-- alter table fx_user_order add index idx_fx_user_order_symbol(`symbol`);
-- alter table fx_user_order add index idx_fx_user_order_openTime(`openTime`);

CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `password` char(16) DEFAULT NULL,
  `salt` char(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `sys_user` VALUES ('1', 'admin', '13905511234', '123123', null);

CREATE TABLE `fx_meta` (
  `id` int(11) NOT NULL,
  `totalProfit` varchar(20) NOT NULL,
  `userCount` int(11) NOT NULL,
  `symbolCount` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

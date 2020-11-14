-- 基本信息表
-- 品种表
CREATE TABLE `symbol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '名称',
  `symbol` varchar(10) DEFAULT NULL COMMENT '简称',
  `standardSymbol` varchar(10) DEFAULT NULL COMMENT '标准',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `type` varchar(20) DEFAULT NULL COMMENT '品种类型',
  `api` varchar(100) DEFAULT NULL COMMENT '接口',
  PRIMARY KEY (`id`),
  KEY `idx_symbol_symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化品种：订单表中所有品种
INSERT into symbol (symbol, standardSymbol, type)
SELECT symbol, standardSymbol, '外汇' from user_order GROUP BY symbol;

-- 增量更新品种：临时表
CREATE TABLE `symbol_delta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '名称',
  `symbol` varchar(10) DEFAULT NULL COMMENT '简称',
  `standardSymbol` varchar(10) DEFAULT NULL COMMENT '标准',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `type` varchar(20) DEFAULT NULL COMMENT '品种类型',
  `api` varchar(100) DEFAULT NULL COMMENT '接口',
  PRIMARY KEY (`id`),
  KEY `idx_symbol_symbol` (`symbol`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;


-- 用户表
CREATE TABLE `user` (
  `userId` int(11) NOT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  `symbol` varchar(500) DEFAULT NULL COMMENT '品种',
  `standardSymbol` varchar(500) DEFAULT NULL COMMENT '品种',
  PRIMARY KEY (`userId`),
  KEY `idx_user_accountId` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化user：订单表中所有用户
INSERT into `user` (userId, accountId, symbol, standardSymbol)
SELECT userId, accountId, GROUP_CONCAT(DISTINCT symbol) as sb, GROUP_CONCAT(DISTINCT standardSymbol) as sdsb from user_order GROUP BY accountId;

-- 用户增量更新临时表
CREATE TABLE `user_delta` (
  `userId` int(11) NOT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  `symbol` varchar(500) DEFAULT NULL COMMENT '品种',
  `standardSymbol` varchar(500) DEFAULT NULL COMMENT '品种',
  PRIMARY KEY (`userId`),
  KEY `idx_user_accountId` (`accountId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 初始化组
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '组名称',
  `abbr` varchar(255) DEFAULT NULL COMMENT '简称',
  `symbol` varchar(100) DEFAULT NULL COMMENT '品种',
  `standardSymbol` varchar(100) DEFAULT NULL COMMENT '品种',
  `userCount` int(11) DEFAULT NULL COMMENT '组用户总数',
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `groups` VALUES ('1', '超级牛散', 'superNB', 'XAUUSD,GBPJPY', 'XAUUSD,GBPJPY', '100', '都是牛B的散户');
INSERT INTO `groups` VALUES ('2', '测试组1', '测试组1', 'XAUUSD,GBPJPY', 'XAUUSD,GBPJPY', '50', '测试组1');
INSERT INTO `groups` VALUES ('3', '测试组2', '测试组2', 'XAUUSD,GBPJPY', 'XAUUSD,GBPJPY', '50', '测试组2');


-- 初始化组成员（随机生成测试）
CREATE TABLE `user_group` (
  `groupId` int(11) NOT NULL COMMENT '组id',
  `accountId` int(11) NOT NULL COMMENT '账号id',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `groupName` varchar(50) DEFAULT NULL COMMENT '组名称',
  `groupAbbr` varchar(20) DEFAULT NULL COMMENT '组简称',
  PRIMARY KEY (`accountId`,`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 INSERT INTO user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '1', accountId, userId, '超级牛散', 'superNB' from `user` ORDER BY RAND() limit 100;
 INSERT INTO user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '2', accountId, userId, '测试组1', '测试组1' from `user` ORDER BY RAND() limit 50;
 INSERT INTO user_group(groupId, accountId, userId, groupName, groupAbbr)
 	SELECT '3', accountId, userId, '测试组2', '测试组2' from `user` ORDER BY RAND() limit 30;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='定时任务日志';

CREATE TABLE `tradedate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startDate` date DEFAULT NULL COMMENT '开始日期',
  `endDate` date DEFAULT NULL COMMENT '结束日期',
  `interval` int(11) DEFAULT NULL COMMENT '间隔',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- 汇总统计表
CREATE TABLE `user_profit_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` int(11) DEFAULT NULL COMMENT '账号',
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `symbol` varchar(20) DEFAULT NULL COMMENT '品种',
  `standardSymbol` varchar(50) DEFAULT NULL COMMENT '品种',
  `profit` decimal(16,6) DEFAULT NULL COMMENT '收益',
  `returnRate` float DEFAULT NULL COMMENT '收益率',
  `tradeDate` date DEFAULT NULL COMMENT '交易日期',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易笔数',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_user_profit_item_accountId` (`accountId`),
  KEY `idx_user_profit_item_symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_profit_total` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `accountId` int(11) DEFAULT NULL,
  `profit` decimal(16,6) DEFAULT NULL COMMENT '收益',
  `symbol` varchar(50) DEFAULT NULL COMMENT '品种',
  `type` varchar(10) DEFAULT NULL COMMENT '类型：期货、外汇',
  PRIMARY KEY (`id`),
  KEY `idx_user_profit_total_accountId` (`accountId`),
  KEY `idx_user_profit_total_symbol` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user_profit_total(userId, accountId, symbol, profit, type) select userId, accountId, symbol, 0 , '外汇' from `user_order` where symbol != '' GROUP BY accountId, symbol;


CREATE TABLE `user_active` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL COMMENT '用户id',
  `accountId` int(11) DEFAULT NULL COMMENT '账号id',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易次数',
  `tradeDate` date DEFAULT NULL COMMENT '交易日期',
  `symbol` varchar(30) DEFAULT NULL COMMENT '品种',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_user_active_accountId` (`accountId`),
  KEY `idx_user_active_tradeDate` (`tradeDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `group_profit` (
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
  KEY `idx_grup_profit_groupId` (`groupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `symbol_profit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `symbol` varchar(20) DEFAULT NULL COMMENT '品种',
  `tradeDate` date DEFAULT NULL,
  `profit` float DEFAULT NULL COMMENT '盈利',
  `loss` float DEFAULT NULL COMMENT '亏损',
  `breakEven` float DEFAULT NULL COMMENT '持平',
  `userCount` int(11) DEFAULT NULL COMMENT '交易人数',
  `tradeCount` int(11) DEFAULT NULL COMMENT '交易次数',
  `tradeMoney` decimal(16,6) DEFAULT NULL COMMENT '交易量',
  `type` varchar(10) DEFAULT NULL COMMENT '外汇 期货',
  PRIMARY KEY (`id`),
  KEY `idx_symbol_profit_symbol` (`symbol`),
  KEY `idx_symbol_profit_tradeDate` (`tradeDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `symbol_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '品种名称',
  `symbol` varchar(20) DEFAULT NULL COMMENT '品种',
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
  KEY `idx_symbol_meta` (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO symbol_meta (`name`, `symbol`, `totalProfit`, `profitRate`, `lossRate`, `breakEvenRate`, `profitMoney`, `lossMoney`, `userCount`)
SELECT `name`, symbol, 0, 0, 0, 0, 0, 0, 0 from symbol;

-- add index
-- alter table user_order add index idx_user_order_accountId(`accountId`);
-- alter table user_order add index idx_user_order_symbol(`symbol`);
-- alter table user_order add index idx_user_order_openTime(`openTime`);

CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `password` char(16) DEFAULT NULL,
  `salt` char(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `sys_user` VALUES ('1', 'admin', '13900511234', '123123', null);

CREATE TABLE `meta` (
  `id` int(11) NOT NULL,
  `totalProfit` varchar(20) NOT NULL,
  `userCount` int(11) NOT NULL,
  `symbolCount` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

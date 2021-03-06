-- 存储过程
-- clean data
DROP PROCEDURE IF EXISTS `clean_all_data`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `clean_all_data`()
BEGIN
--    TRUNCATE TABLE `fx_user`;
--    TRUNCATE TABLE `fx_symbol`;
--    TRUNCATE TABLE `fx_groups`;
--    TRUNCATE TABLE `fx_user_group`;
	TRUNCATE TABLE fx_user_profit_item;
	TRUNCATE TABLE fx_group_profit;
	TRUNCATE TABLE fx_symbol_profit;
	TRUNCATE TABLE fx_user_active;
	TRUNCATE TABLE fx_user_profit_total;
	TRUNCATE TABLE fx_symbol_meta;
	TRUNCATE TABLE schedule_job_log;
end
;;
DELIMITER ;

-- CALL clean_all_data();

-- 聚合
-- 1. 用户收益汇总： 按天、按品种
DROP PROCEDURE IF EXISTS `update_fx_user_profit`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_user_profit`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10), type VARCHAR(10))
begin
  INSERT INTO fx_user_profit_item (userId, accountId, standardSymbol,  profit, tradeCount, tradedate, type)
	SELECT userId, accountId, standardSymbol,  sum(profit+commission+swap) as netProfit, count(*) as tradeCount, DATE_FORMAT(openTime,'%Y-%m-%d') as tradedate, '外汇'
	   from fx_user_order
		where DATE_FORMAT(openTime,'%Y-%m-%d') > tradeStart and DATE_FORMAT(openTime,'%Y-%m-%d') <= tradeEnd AND `type` = type
		GROUP BY accountId, standardSymbol, DATE_FORMAT(openTime,'%Y-%m-%d');
end
;;
DELIMITER ;


-- 2. 品种收益汇总（品种盈亏用户占比）： 按品种、按天
DROP PROCEDURE IF EXISTS `update_fx_symbol_profit`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_symbol_profit`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10), type VARCHAR(10))
begin
  INSERT INTO fx_symbol_profit (standardSymbol, tradedate, profit, loss, breakEven, userCount, tradeCount, tradeMoney, type)

	SELECT total.standardSymbol, total.tradeDate,
	       profit.profitCount/total.totalCount as profitRate,  loss.lossCount/total.totalCount as lossRate ,  breakEven.breakEvenCount/total.totalCount as breakEvenRate ,
	       0, total.totalCount, total.tradeMoney, '外汇'
	from
	  (SELECT standardSymbol, tradeDate, count(*) as totalCount, sum(profit) as tradeMoney
		from fx_user_profit_item
	    where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd AND `type` = type
		GROUP BY standardSymbol, tradeDate) as total
	  LEFT JOIN
	  (SELECT standardSymbol, tradeDate, count(*) as profitCount
		from fx_user_profit_item
	      where profit > 0  and  `tradeDate` > tradeStart and `tradeDate` <= tradeEnd AND `type` = type
		  GROUP BY standardSymbol, tradeDate) as profit ON total.standardSymbol = profit.standardSymbol and total.tradeDate = profit.tradeDate
	   LEFT JOIN
	  (SELECT standardSymbol, tradeDate, count(*) as lossCount
		from fx_user_profit_item
	      where profit < 0  and `tradeDate` > tradeStart and `tradeDate` <= tradeEnd AND `type` = type
		  GROUP BY standardSymbol, tradeDate) as loss ON total.standardSymbol = loss.standardSymbol and total.tradeDate = loss.tradeDate
	  LEFT JOIN
	 (SELECT standardSymbol, tradeDate, count(*) as breakEvenCount
		from fx_user_profit_item
	      where profit = 0  and  `tradeDate` > tradeStart and `tradeDate` <= tradeEnd AND `type` = type
		  GROUP BY standardSymbol, tradeDate) as breakEven ON total.standardSymbol = breakEven.standardSymbol and total.tradeDate = breakEven.tradeDate;
end
;;
DELIMITER ;


-- 3. 组收益汇总： 按组、按天
DROP PROCEDURE IF EXISTS `update_fx_group_profit`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_group_profit`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10), type VARCHAR(10))
begin
  INSERT INTO fx_group_profit (groupId, groupName, groupAbbr, tradeDate, profit, userCount, type)
    SELECT t4.groupId, t4.groupName, t4.groupAbbr, t4.tradeDate, t4.groupProfit, t5.userCount, '外汇' from (
		SELECT t3.groupId, t3.groupName, t3.groupAbbr, t3.tradeDate, sum(t3.totalProfilt) as groupProfit from (
			SELECT t1.groupId, t1.groupName, groupAbbr, t2.userId, t2.accountId, t2.tradeDate, t2.totalProfilt from fx_user_group t1
				 INNER JOIN
					 ( SELECT userId, accountId, tradeDate, sum(profit) as totalProfilt from fx_user_profit_item
					 	WHERE `tradeDate` > tradeStart and `tradeDate` <= tradeEnd AND `type` = type
					 	GROUP BY userId, tradeDate ) t2 ON t1.userId = t2.userId
			) t3 GROUP BY t3.groupId, t3.tradeDate
		) t4 LEFT JOIN `fx_groups` as t5 on t4.groupId = t5.id;
end
;;
DELIMITER ;


-- 4. 活跃用户排名： 按人、按天、按品种
DROP PROCEDURE IF EXISTS `update_fx_user_active`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_user_active`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10), type VARCHAR(10))
begin
  INSERT INTO fx_user_active(userId, accountId, tradeCount, tradeDate,  standardSymbol, type)
	SELECT userId, accountId, SUM(tradeCount) as activity, tradeDate, standardSymbol, type from fx_user_profit_item
       WHERE `tradeDate` > tradeStart and `tradeDate` <= tradeEnd  AND `type` = type
	   GROUP BY accountId, tradeDate, standardSymbol;
end
;;
DELIMITER ;

-- 5. 用户收益总表： 按人
-- 先初始化所有人为0， 任务增量更新总收益
DROP PROCEDURE IF EXISTS `update_fx_user_profit_total`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_user_profit_total`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10))
begin
  UPDATE fx_user_profit_total t1
	INNER JOIN (select accountId, standardSymbol, sum(profit) as totalProfit, '外汇' from fx_user_profit_item WHERE `tradeDate` > tradeStart and `tradeDate` <= tradeEnd GROUP BY accountId, standardSymbol) t2
     ON t1.accountId = t2.accountId and t1.standardSymbol = t2.standardSymbol
  SET t1.profit = t1.profit + t2.totalProfit;
end
;;
DELIMITER ;

-- 6. 品种meta汇总信息
-- 初始化所有品种汇总信息， 任务增量更新总收益
-- 6.1
DROP PROCEDURE IF EXISTS `update_fx_symbol_meta`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_symbol_meta`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10))
begin
  -- 更新单品种汇总统计
  UPDATE fx_symbol_meta t1
	INNER JOIN
	(SELECT total.standardSymbol,  total.totalProfit,
					 profit.profitCount/total.totalCount as profitRate,  loss.lossCount/total.totalCount as lossRate ,  breakEven.breakEvenCount/total.totalCount as breakEvenRate,
				 profit.profitMoney, loss.lossMoney, total.userCount
		from
			(SELECT standardSymbol, count(*) as totalCount, SUM(profit) as totalProfit, COUNT(DISTINCT accountId, standardSymbol) as userCount
			from fx_user_profit_item
				where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd
			GROUP BY standardSymbol) as total
			LEFT JOIN
			(SELECT standardSymbol, count(*) as profitCount, SUM(profit) as profitMoney
			from fx_user_profit_item
					where profit > 0  and  `tradeDate` > tradeStart and `tradeDate` <= tradeEnd
				GROUP BY standardSymbol) as profit ON total.standardSymbol = profit.standardSymbol
			 LEFT JOIN
			(SELECT standardSymbol, count(*) as lossCount, SUM(profit) as lossMoney
			from fx_user_profit_item
					where profit < 0  and `tradeDate` > tradeStart and `tradeDate` <= tradeEnd
				GROUP BY standardSymbol) as loss ON total.standardSymbol = loss.standardSymbol
			LEFT JOIN
		 (SELECT standardSymbol, count(*) as breakEvenCount
			from fx_user_profit_item
					where profit = 0  and  `tradeDate` > tradeStart and `tradeDate` <= tradeEnd
				GROUP BY standardSymbol) as breakEven ON total.standardSymbol = breakEven.standardSymbol) t2 on t1.standardSymbol = t2.standardSymbol
  SET t1.`totalProfit` = t1.`totalProfit`+ t2.totalProfit, t1.`profitRate`=t2.profitRate, t1.`lossRate` = t2.lossRate, t1.`breakEvenRate`=t2.breakEvenRate,
	  t1.`profitMoney`=t2.profitMoney, t1.`lossMoney`=t2.lossMoney, t1.`userCount` = t2.userCount;

  -- 更新品种总汇总统计
  UPDATE fx_symbol_meta t1
        INNER JOIN
        (SELECT 'x' as `name`, total.standardSymbol, total.totalProfit,
                    profit.profitUserCount/total.userCount as profitRate,  loss.lossUserCount/total.userCount as lossRate,  breakEven.breakEvenUserCount/total.userCount as breakEvenRate,
                    total.userCount, profit.profitUserCount, loss.lossUserCount, breakEven.breakEvenUserCount,
         				   profit.profitMoney, loss.lossMoney
         		from
         			(SELECT 'x' as `standardSymbol`, count(*) as totalCount, SUM(profit) as totalProfit, COUNT(DISTINCT accountId) as userCount
         			from fx_user_profit_item where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd ) as total
         			LEFT JOIN
         			(SELECT 'x' as `standardSymbol`, sum(profitMoney) as profitMoney, count(*) as profitUserCount from (
         				 SELECT accountId, SUM(profit) as profitMoney
         						from fx_user_profit_item where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd GROUP BY accountId HAVING profitMoney > 0) as t1 ) as profit ON total.standardSymbol = profit.standardSymbol
         			 LEFT JOIN
         			(SELECT 'x' as `standardSymbol`, sum(profitMoney) as lossMoney, count(*) as lossUserCount from (
         				 SELECT accountId, SUM(profit) as profitMoney
         						from fx_user_profit_item where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd GROUP BY accountId HAVING profitMoney < 0) as t2 ) as loss ON total.standardSymbol = profit.standardSymbol
         			LEFT JOIN
         		 (SELECT 'x' as `standardSymbol`, sum(profitMoney) as breakevenMoney, count(*) as breakEvenUserCount from (
         				 SELECT accountId, SUM(profit) as profitMoney
         						from fx_user_profit_item where `tradeDate` > tradeStart and `tradeDate` <= tradeEnd GROUP BY accountId HAVING profitMoney = 0) as t1 ) as breakEven ON total.standardSymbol = profit.standardSymbol) t2 on t1.standardSymbol = t2.standardSymbol
  SET t1.`totalProfit`= t1.`totalProfit`+ t2.totalProfit, t1.`profitRate`=t2.profitRate, t1.`lossRate` = t2.lossRate, t1.`breakEvenRate`=t2.breakEvenRate,
      t1.`profitMoney`= t1.`profitMoney`+ t2.profitMoney, t1.`lossMoney`= t1.`lossMoney` + t2.lossMoney, t1.`userCount` = t1.`userCount` + t2.userCount, t1.`profitUserCount` = t1.`profitUserCount` + t2.profitUserCount,
      t1.`lossUserCount` = t1.`lossUserCount` + t2.lossUserCount, t1.`breakEvenUserCount` = t1.`breakEvenUserCount` + t2.breakEvenUserCount;
end
;;
DELIMITER ;

-- 6.2
-- 汇总更新品种用户总数信息： 品种总用户数、 盈利总用户数、 亏损总用户数、 持平用户数
DROP PROCEDURE IF EXISTS `update_fx_symbol_meta_user_count`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_fx_symbol_meta_user_count`()
BEGIN
DECLARE symbolParam VARCHAR(20);
DECLARE fetchSeqOk BOOLEAN;
DECLARE symbol_cur CURSOR FOR SELECT s.standardSymbol FROM fx_symbol_meta s;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET fetchSeqOk = true;
SET fetchSeqOk = FALSE;
OPEN symbol_cur;
symbol_cur:LOOP
   FETCH symbol_cur INTO symbolParam;
    IF fetchSeqOk THEN
       LEAVE symbol_cur;
    ELSE
      -- 更新symbol 用户数信息
      -- 盈利用户数
      UPDATE fx_symbol_meta t1
			INNER JOIN (SELECT symbolParam as standardSymbol , count(*) as profitUserCount from (SELECT accountId, sum(profit) as userProfit from fx_user_profit_item where  standardSymbol = symbolParam group by accountId HAVING userProfit > 0) t2 ) t3 on t1.standardSymbol = t3.standardSymbol
	  SET t1.profitUserCount = t3.profitUserCount;
      -- 亏损用户数
      UPDATE fx_symbol_meta t1
            INNER JOIN (SELECT symbolParam as standardSymbol , count(*) as profitUserCount from (SELECT accountId, sum(profit) as userProfit from fx_user_profit_item where  standardSymbol = symbolParam group by accountId HAVING userProfit < 0) t2 ) t3 on t1.standardSymbol = t3.standardSymbol
      SET t1.lossUserCount = t3.profitUserCount;
      -- 持平用户数
      UPDATE fx_symbol_meta t1
            INNER JOIN (SELECT symbolParam as standardSymbol , count(*) as profitUserCount from (SELECT accountId, sum(profit) as userProfit from fx_user_profit_item where  standardSymbol = symbolParam group by accountId HAVING userProfit = 0) t2 ) t3 on t1.standardSymbol = t3.standardSymbol
      SET t1.breakEvenUserCount = t3.profitUserCount;
    END IF;
END LOOP;
CLOSE symbol_cur;
END
;;
DELIMITER ;

-- 7. 更新品种基本信息
DROP PROCEDURE IF EXISTS `delta_import_fx_symbol`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delta_import_fx_symbol`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10))
begin
  INSERT into fx_symbol_delta (symbol, standardSymbol)
	SELECT symbol, standardSymbol from fx_user_order WHERE DATE_FORMAT(openTime,'%Y-%m-%d') > tradeStart and DATE_FORMAT(openTime,'%Y-%m-%d') <= tradeEnd GROUP BY standardSymbol;

	INSERT INTO fx_symbol(standardSymbol,  type)
	SELECT standardSymbol,  '外汇' from fx_symbol_delta where standardSymbol NOT IN (SELECT standardSymbol from fx_symbol);

    INSERT INTO fx_symbol_meta (`name`, `standardSymbol`, `userCount`, `totalProfit`, `profitRate`, `lossRate`, `breakEvenRate`, `profitUserCount`, `lossUserCount`, `breakEvenUserCount`, `profitMoney`, `lossMoney`)
    SELECT `name`, standardSymbol, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 from fx_symbol_delta where standardSymbol NOT IN (SELECT standardSymbol from fx_symbol);

	TRUNCATE table fx_symbol_delta;
end
;;
DELIMITER ;

-- 8. 更新用户信息
DROP PROCEDURE IF EXISTS `delta_import_fx_user`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delta_import_fx_user`(tradeStart VARCHAR(10), tradeEnd VARCHAR(10))
begin
	INSERT into fx_user_delta (userId, accountId)
       SELECT userId, accountId from fx_user_order
       WHERE DATE_FORMAT(openTime,'%Y-%m-%d') > tradeStart and DATE_FORMAT(openTime,'%Y-%m-%d') <= tradeEnd GROUP BY accountId;

	INSERT INTO `fx_user`(userId, accountId)
	   SELECT userId, accountId from fx_user_delta where userId NOT IN (SELECT userId from fx_user_order);

	INSERT INTO fx_user_profit_total(userId, accountId, profit)
	   SELECT userId, accountId, 0 from fx_user_delta where userId NOT IN (SELECT userId from fx_user_order);

	TRUNCATE table fx_user_delta;
end
;;
DELIMITER ;

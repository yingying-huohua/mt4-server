 -- step 1: 用户收益汇总
 call update_fx_user_profit('2010-11-28', '2020-11-28', '外汇'); -- fx_user_profit_item

-- 用户总收益汇总
 call update_fx_user_profit_total('2010-11-28', '2020-11-28'); -- fx_user_profit_total

-- 用户组收益汇总
 CALL update_fx_group_profit('2010-11-28', '2020-11-28', '外汇'); -- fx_group_profit

-- 用户活跃度统计汇总
 CALL update_fx_user_active('2010-11-28', '2020-11-28', '外汇'); -- fx_user_active

-- 品种收益汇总
 CALL update_fx_symbol_profit('2010-11-28', '2020-11-28', '外汇'); -- fx_symbol_profit

-- 品种meta信息统计
 CALL update_fx_symbol_meta('2010-11-28', '2020-11-28'); -- fx_symbol_meta

 CALL update_fx_symbol_meta_user_count(); -- fx_symbol_meta

-- 增量导入用户
 CALL delta_import_fx_user('2010-11-28', '2020-11-28'); -- fx_user

-- 增量导入品种
 CALL delta_import_fx_symbol('2010-11-28', '2020-11-28'); -- fx_symbol

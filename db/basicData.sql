
INSERT INTO `site` (`id_site`, `domain`, `theme`, `name`, `sort`, `active`) VALUES (NULL, '/^.*$/', 'seven', 'UI2', '10', '1');

INSERT INTO `admin` (`id_admin`, `login`, `name`, `pass`, `timezone`, `active`, `phone`, `txt`)
VALUES
	(1, '_LOGIN_', '_ADMIN_', '_PASSWORD_', 'America/Los_Angeles', 1, '_PHONE_','_PHONE_');

INSERT INTO `admin_notification` (`id_admin`, `type`, `value`, `active`)
VALUES
	(1, 'sms', '_PHONE_', 1);

INSERT INTO `group` (`id_group`, `name`)
VALUES (1,'admin');
    
INSERT INTO `admin_group` (`id_admin`, `id_group`)
VALUES
	(1,1);

INSERT INTO `admin_permission` (`id_admin`, `permission`, `id_group`, `allow`)
VALUES
	(NULL,'global',1,1),
	(1,'test',NULL,1);


INSERT INTO `group` (`name`, `description`) VALUES ( 'rule-time-order', 'Users will receive the notification when someone order twice in a short period of time' );
INSERT INTO `group` (`name`, `description`) VALUES ( 'rule-order-equal', 'Users will receive the notification when someone order the same food in a short period of time' );
INSERT INTO `group` (`name`, `description`) VALUES ( 'rule-gift-card', 'Users will receive the notification when someone redeem two or more gift cards short period of time' );
INSERT INTO `group` (`name`, `description`) VALUES ( 'reps-none-working', 'Users will receive the sms when no drives are working' );
INSERT INTO `group` (`name`, `description`) VALUES ( 'restaurant', 'Restaurant group' );
INSERT INTO `group` (`name`, `description`) VALUES ('community-cs', 'Community CS');

/* INSERT THE CHARTS */
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 1, 'churn-rate-per-active-user-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 2, 'churn-rate-per-active-user-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 3, 'churn-rate-per-active-user-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 4, 'churn-rate-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 5, 'churn-rate-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 6, 'churn-rate-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 7, 'gift-cards-created-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 8, 'gift-cards-created-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 9, 'gift-cards-created-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 10, 'gift-cards-redeemed-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 11, 'gift-cards-redeemed-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 12, 'gift-cards-redeemed-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 13, 'gross-revenue-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 14, 'gross-revenue-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 15, 'gross-revenue-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 16, 'orders-by-weekday-by-community', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 17, 'orders-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 18, 'orders-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 19, 'orders-per-restaurant-by-community', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 20, 'orders-per-user-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 21, 'orders-per-user-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 22, 'orders-per-user-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 23, 'orders-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 24, 'orders-repeat-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 25, 'orders-repeat-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 26, 'orders-repeat-per-active-user-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 27, 'orders-repeat-per-active-user-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 28, 'orders-repeat-per-active-user-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 29, 'orders-repeat-vs-news-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 30, 'orders-repeat-vs-news-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 31, 'orders-repeat-vs-news-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 32, 'orders-repeat-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 33, 'orders-track-frequece', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 34, 'users-active-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 35, 'users-active-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 36, 'users-active-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 37, 'users-new-per-active-users-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 38, 'users-new-per-active-users-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 39, 'users-new-per-active-users-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 40, 'users-new-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 41, 'users-new-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 42, 'users-new-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 43, 'users-reclaimed-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 44, 'users-reclaimed-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 45, 'users-reclaimed-per-week', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 46, 'users-track-frequece', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 47, 'users-unique-per-day', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 48, 'users-unique-per-month', '');
INSERT INTO `chart` (`id_chart`, `permalink`, `description`) VALUES( 49, 'users-unique-per-week', '');

INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-per-day', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-per-week', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-per-month', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'users-new-per-day-historical', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'users-new-per-week-historical', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'users-new-per-month-historical', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-rate-per-day', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-rate-per-week', '');
INSERT INTO `chart` ( `permalink`, `description`) VALUES( 'historial-churn-rate-per-month', '');


INSERT INTO `driver_document` (`id_driver_document`, `name`, `url`, `order`)
VALUES
	(1, 'Independant Contractor Agreement', '_URL_', 1),
	(2, 'W9', '_URL_', 2),
	(3, 'Direct Deposit', '_URL_', 3),
	(4, 'Drivers License', '', 4),
	(5, 'Insurance Card','', 5);

UPDATE driver_document SET type = 'driver';

INSERT INTO `driver_document` ( `name`, `order`, `url`, `required`, `type`)
VALUES
	('Independent Contractor Agreement', 1, '_URL_', 1, 'marketing-rep'),
	('W9', 2, '_URL_', 1, 'marketing-rep'),
	('Direct Deposit', 3, '_URL_', 1, 'marketing-rep');


INSERT INTO `admin` ( `login`, `name`, `phone`, `txt`, `email`, `pass`, `timezone`, `testphone`, `active`, `invite_code`, `referral_admin_credit`, `referral_customer_credit`, `id_admin_author`)
VALUES
	('autoshutdowncommunity', 'Auto Shut Down Community', NULL, NULL, NULL, NULL, 'America/New_York', NULL, 1, NULL, NULL, NULL, NULL);


INSERT INTO `order_forecast_type` VALUES (1,'Mean based on EW weighting with decay constant of 4 wks');

INSERT INTO queue_type ( `type` ) VALUES ( 'order' );
INSERT INTO queue_type ( `type` ) VALUES ( 'notification-driver' );
INSERT INTO queue_type ( `type` ) VALUES ( 'order-confirm' );
INSERT INTO queue_type ( `type` ) VALUES ( 'order-receipt' );
INSERT INTO queue_type ( `type` ) VALUES ( 'notification-your-driver' );
INSERT INTO queue_type ( `type` ) VALUES ( 'order-pexcard-funds' );
INSERT INTO queue_type ( `type` ) VALUES ( 'notification-minutes-way' );
INSERT INTO queue_type ( `type` ) VALUES ( 'notification-driver-priority' );
INSERT INTO queue_type ( `type` ) VALUES ( 'settlement-driver' );
INSERT INTO queue_type ( `type` ) VALUES ( 'settlement-restaurant' );
INSERT INTO queue_type ( `type` ) VALUES ( 'restaurant-time' );

INSERT INTO `report` (`title`, `content`, `active`)
VALUES ('Communities closed', 'SELECT name as Community, \'yes\' as \'Closed\' FROM community WHERE close_all_restaurants AND active = 1 ORDER BY name ASC\n', 1);

INSERT INTO `report` (`title`, `content`, `active`)
VALUES ('Communities with 3rd Party Delivery restaurants closed', 'SELECT name as Community, \'yes\' as \'Closed\' FROM community WHERE close_3rd_party_delivery_restaurants AND active = 1 ORDER BY name ASC', 1);

INSERT INTO `log_type` (`type`)
VALUES
		('account-js'),
		('admin-hours'),
		('admin-notification'),
		('card-error'),
		('claim-account'),
		('closed'),
		('connect-call'),
		('cron-jobs'),
		('delivery-driver'),
		('dishes'),
		('dispatch-notification'),
		('driver-customer'),
		('driver-remind'),
		('driver-schedule'),
		('driver-sms'),
		('driver-warning'),
		('drivers-onboarding'),
		('game-score'),
		('gift-card-warning'),
		('incoming-sms'),
		('location-js'),
		('max-call'),
		('notification'),
		('options-dishes'),
		('options-dishes-removed'),
		('order'),
		('order-js'),
		('order-log'),
		('order-rules'),
		('pexcard'),
		('promo-email'),
		('promo-sms'),
		('referral'),
		('settlement'),
		('sms'),
		('suggestion'),
		('support'),
		('support-sms'),
		('user-sms'),
		('unknown'),
		('wrong-delivery-type');


INSERT INTO `config` (`id_config`, `id_site`, `key`, `value`, `exposed`)
VALUES
	(1,NULL,'support-phone-afterhours','_PHONE_',0),
	(2,NULL,'referral-inviter-credit-value','1',0),
	(3,NULL,'referral-invited-credit-value','1',0),
	(4,NULL,'referral-add_credit-to-invited','1',0),
	(5,NULL,'referral-limit-per-code','0',0),
	(6,NULL,'referral-is-enable','0',0),
	(7,NULL,'referral-add-credit-to-invited',NULL,0),
	(8,NULL,'referral-invites-limit-per-code','100',0),
	(9,NULL,'rule-time-since-last-order-time','30',0),
	(10,NULL,'rule-time-since-last-order-active','1',0),
	(11,NULL,'rule-time-since-last-order-cs','1',0),
	(12,NULL,'rule-time-since-last-order-reps','1',0),
	(13,NULL,'rule-time-since-last-order-equal-time','30',0),
	(14,NULL,'rule-time-since-last-order-equal-active','1',0),
	(15,NULL,'rule-time-since-last-order-equal-cs','1',0),
	(16,NULL,'rule-time-since-last-order-equal-reps','1',0),
	(17,NULL,'rule-gift-card-redeemed-time','30',0),
	(18,NULL,'rule-gift-card-redeemed-active','1',0),
	(19,NULL,'rule-gift-card-redeemed-cs','1',0),
	(20,NULL,'rule-gift-card-redeemed-reps','1',0),
	(21,NULL,'cockpit-expanded-view-checked-as-default','1',0),
	(22,NULL,'rule-monitor-name-phone-active','1',0),
	(23,NULL,'rule-monitor-name-phone-name','Sean Glass, Clark, Landry, Clark Landry, bacon',0),
	(24,NULL,'rule-monitor-name-phone-phone','_PHONE_,',0),
	(25,NULL,'rule-monitor-name-phone-warning-phone','_PHONE_',0),
	(26,NULL,'rule-monitor-name-phone-warning-email','_EMAIL_',0),
	(27,NULL,'notification-admin-is-enable','1',0),
	(28,NULL,'notification-admin-is-enable-takeout','0',0),
	(29,NULL,'notification-max-call-support-group-name','max-call-support',0),
	(30,NULL,'notification-max-call-recall-after-min','3',0),
	(31,NULL,'notification-max-call-support-say','press 1 to confirm youve received this call. otherwise, we will call you back.',0),
	(32,NULL,'rep-fail-group-name','reps-fail-pickup',0),
	(33,NULL,'rule-time-since-last-order-group','rule-time-order',0),
	(34,NULL,'rule-time-since-last-order-equal-group','rule-order-equal',0),
	(35,NULL,'rule-gift-card-redeemed-group','rule-gift-card',0),
	(36,NULL,'reps-none-working-group-name','reps-none-working',0),
	(37,NULL,'notification-admin-use-new-notify-method','1',0),
	(38,NULL,'custom-service-group-name','support',0),
	(39,NULL,'ui2-mobile-force','1',0),
	(50,NULL,'reward_points_per_cents_value','0',0),
	(51,NULL,'reward_points_per_cents_operation','*',0),
	(52,NULL,'reward_points_shared_order_value','0',0),
	(53,NULL,'reward_points_shared_order_operation','*',0),
	(54,NULL,'reward_points_get_referred_value','1000000',0),
	(55,NULL,'reward_points_refer_new_user_value','1000000',0),
	(56,NULL,'reward_points_make_acount_value','1',0),
	(57,NULL,'reward_points_make_acount_operation','*',0),
	(58,NULL,'reward_points_order_value_over_amount','25',0),
	(59,NULL,'reward_points_order_value_over_value','1',0),
	(60,NULL,'reward_points_order_value_over_operation','*',0),
	(61,NULL,'reward_points_win_cluckbutton_value','3500',0),
	(62,NULL,'reward_points_order_twice_week_value','1',0),
	(63,NULL,'reward_points_order_twice_week_operation','*',0),
	(64,NULL,'reward_points_order_2_days_row_value','1',0),
	(65,NULL,'reward_points_order_2_days_row_operation','*',0),
	(66,NULL,'reward_points_get_referred_discount_amt',NULL,1),
	(67,NULL,'reward_points_admin_refer_user_amt','5',1),
	(68,NULL,'reward_points_refer_new_user_amt',NULL,0),
	(69,NULL,'settlement-id_order-start','26668',0),
	(70,NULL,'chat-server-port','443',0),
	(71,NULL,'chat-server','https://event.cockpit.la/',0),
	(72,NULL,'chat-server-key','_KEY_',0),
	(73,NULL,'cbtn_forward','true',0),
	(74,NULL,'twilio-number','_PHONE_',0),
	(79,NULL,'pex_amount_shift_start','20',0),
	(80,NULL,'pex_card_funds_shift_enable','1',0),
	(81,NULL,'pex_card_funds_order_enable','1',0),
	(82,NULL,'pex_card_funds_order_enable_for_cash',NULL,0),
	(91,NULL,'pex_test_card','27',0),
	(92,NULL,'pex_test_card','976',0),
	(93,NULL,'pex_test_card','222',0),
	(94,NULL,'pex_test_card','297',0),
	(95,NULL,'pex_test_card','293',0),
	(96,NULL,'pex_test_card','200',0),
	(97,NULL,'pex_test_card','961',0),
	(98,NULL,'pex_test_card','14',0),
	(99,NULL,'pex_test_card','195',0),
	(100,NULL,'pex_test_card','290',0),
	(101,NULL,'pex_test_card','26',0),
	(102,NULL,'pex_test_card','689',0),
	(103,NULL,'pex_test_card','644',0),
	(104,NULL,'pex_test_card','223',0),
	(105,NULL,'pex_test_card','933',0),
	(106,NULL,'testttttx1',NULL,0),
	(110,NULL,'reward_points_max_cap_points','1000000',0),
	(115,NULL,'auto_close_use_community_hours','1',0),
	(118,NULL,'pex_test_card','1460',0),
	(121,NULL,'pex_business_card','1169',0),
	(124,NULL,'pex_business_card','181',0),
	(127,NULL,'pex_business_card','181',0),
	(129,NULL,'processor_payments_capture','1',0),
	(132,NULL,'processor_payments','stripe',0),
	(141,NULL,'pex-card-active','1',0),
	(144,NULL,'processor_settlement','stripe',0),
	(145,NULL,'rule-gift-card-redeemed-time','30',0),
	(148,NULL,'rule-gift-card-redeemed-active','1',0),
	(151,NULL,'rule-gift-card-redeemed-group','rule-gift-card',0),
	(154,NULL,'rule-gift-card-redeemed-reps',NULL,0),
	(157,NULL,'rule-time-since-last-order-time','30',0),
	(160,NULL,'rule-time-since-last-order-active','1',0),
	(163,NULL,'rule-time-since-last-order-group','rule-time-order',0),
	(166,NULL,'rule-time-since-last-order-reps',NULL,0),
	(169,NULL,'rule-time-since-last-order-equal-time','30',0),
	(172,NULL,'rule-time-since-last-order-equal-active','1',0),
	(175,NULL,'rule-time-since-last-order-equal-group','rule-order-equal',0),
	(178,NULL,'rule-time-since-last-order-equal-reps',NULL,0),
	(181,NULL,'rule-monitor-name-phone-active','1',0),
	(184,NULL,'rule-monitor-name-phone-name','Sean Glass, Clark, Landry, Clark Landry, bacon',0),
	(187,NULL,'rule-monitor-name-phone-phone','_PHONE_',0),
	(190,NULL,'rule-monitor-name-phone-warning-phone','_PHONE_',0),
	(193,NULL,'rule-monitor-name-phone-warning-email','_EMAIL_',0),
	(196,NULL,'auto-reply-text','Hey, thanks for texting, we\'ll be with ya in a second! -Crunchbutton',0),
	(198,NULL,'pex_business_card','2779',0),
	(201,NULL,'pex_test_card','2779',0),
	(204,NULL,'pex_business_card','2779',0),
	(206,NULL,'driver_change_amount','20',1),
	(209,NULL,'restaurant-awesome','_KEY_',0),
	(210,NULL,'pex_business_card','2673',0),
	(212,NULL,'blocked-customer-message','Oops, something bad happened!',0),
	(215,NULL,'menu_item_1_label','Free Food',1),
	(218,NULL,'menu_item_1_url','/free-food',1),
	(221,2,'cockpit-min-app-version','1.1.7',1),
	(224,1,'apple-pay','0',1),
	(225,NULL,'david-is-awesome','_KEY_',0),
	(227,NULL,'allow-cors','1',0),
	(230,NULL,'suggestions','1',1),
	(232,NULL,'maintenance','0',0),
	(234,NULL,'s3-bundle','0',0),
	(235,NULL,'order-loading-phrase','Building a perpetual motion machine',0),
	(236,NULL,'order-loading-phrase','Locating Atlantis',0),
	(237,NULL,'order-loading-phrase','Proving the ABC Conjecture',0),
	(238,NULL,'order-loading-phrase','Counting to 1,000,000,000',0),
	(239,NULL,'order-loading-phrase','Restoring peace to the Middle East',0),
	(240,NULL,'order-loading-phrase','Escaping the Bermuda Triangle',0),
	(241,NULL,'order-loading-phrase','Photographing Bigfoot',0),
	(242,NULL,'order-loading-phrase','Waiting for the Angels to win the Pennant',0),
	(243,NULL,'order-loading-phrase','Optomizing the Traveling Salesman\'s route in polynomial time',0),
	(244,NULL,'order-loading-phrase','Reversing entropy',0),
	(245,NULL,'order-loading-phrase','Solving a problem like Maria',0),
	(246,NULL,'order-loading-phrase','Teaching an old dog new tricks',0),
	(247,NULL,'order-loading-phrase','Identifying JFK\'s killer',0),
	(248,NULL,'order-loading-phrase','Defining the Tao',0),
	(249,NULL,'order-loading-phrase','Adding apples to oranges',0),
	(250,NULL,'order-loading-phrase','Doing a 1080',0),
	(251,NULL,'order-loading-phrase','Attaining enlightenment',0),
	(252,NULL,'order-loading-phrase','Having our cake and eating it as well',0),
	(253,NULL,'order-loading-phrase','Your food is being raised and harvested',0),
	(254,NULL,'order-loading-phrase','Ending world hunger',0),
	(255,NULL,'order-loading-phrase','Inventing strong AI',0),
	(256,NULL,'order-loading-phrase','Finding extraterrestrial life',0),
	(257,NULL,'order-loading-phrase','Beating the stock market',0),
	(258,NULL,'order-loading-phrase','Stopping global warming',0),
	(259,NULL,'order-loading-phrase','Becoming one with Christ',0),
	(260,NULL,'order-loading-phrase','Describing the universal grammar',0),
	(261,NULL,'order-loading-phrase','Lowering our Erdos number',0),
	(262,NULL,'order-loading-phrase','Curing Ebola',0),
	(263,NULL,'order-loading-phrase','Detaching ourselves from material things',0),
	(264,NULL,'order-loading-phrase','Understanding consciousness',0),
	(265,NULL,'order-loading-phrase','Polishing up the Unified Field Theory',0),
	(266,NULL,'order-loading-phrase','Looking up the definition of runcible',0),
	(267,NULL,'order-loading-phrase','Burning a tree to power the server',0),
	(268,NULL,'create_driver_shift_buffer','15',0),
	(269,NULL,'pex_business_card','3312',0),
	(270,NULL,'pex_test_card','3312',0),
	(271,NULL,'pex_business_card','3312',0),
	(272,NULL,'pex_test_card','3312',0),
	(273,NULL,'pex_test_card','3312',0),
	(274,NULL,'notify_community_opened_driver','1',0),
	(275,NULL,'notify_community_opened_driver_email','1',0),
	(276,NULL,'notify_community_opened_driver_push',NULL,0),
	(277,NULL,'notify_community_opened_driver_sms',NULL,0),
	(278,NULL,'notify_community_opened_driver_msg','Hey, Crunchbutton %community% is open and accepting orders! :)',0),
	(279,NULL,'notify_community_opened_driver_days','30',0),
	(280,NULL,'cs_config_call_driver','1',0),
	(281,NULL,'cs_config_call_default_phone','_PHONE_',0),
	(282,NULL,'pex_business_card','622',0),
	(283,NULL,'pex_business_card','1950',0),
	(284,NULL,'order_ticket_radius','1',0),
	(285,NULL,'order_ticket_geo',NULL,0),
    (286,NULL,'time_use_12_hours','0',0),
    (287,NULL,'language_iso_code','de',0),
    (288,NULL,'recommend_app_to_android','1',0),
    (289,NULL,'recommend_app_to_ios','1',0)
    ON DUPLICATE KEY UPDATE
    	`id_site` = values(`id_site`) ,
        `key` = values(`key`) ,
        `value` = values(`value`) , 
        `exposed` = values(`exposed`);

INSERT INTO `cron_log` (`id_cron_log`, `description`, `class`, `start_date`, `interval`, `interval_unity`, `current_status`, `next_time`, `finished`, `interactions`, `env`)
VALUES
	(2,'Remind drivers a day before their shift','Crunchbutton_Cron_Job_DriversRemindAboutTheirShiftTomorrow','2014-05-26 16:00:00','day',1,'idle','2016-10-17 17:00:00','2016-10-16 17:44:56',863,'live'),
	(3,'Renotify drivers about not confirmed orders','Crunchbutton_Cron_Job_RenotifyDrivers','2014-05-26 16:00:00','minute',3,'running','2016-10-17 02:15:00','2016-10-16 12:57:58',414098,'live'),
	(4,'Test to check if the cron is running every minute','Crunchbutton_Cron_Job_Test','2014-05-26 13:00:00','minute',1,'running','2016-10-17 02:13:00','2016-10-16 12:57:58',1248848,'live'),
	(5,'Remind drivers minutes before their shift','Crunchbutton_Cron_Job_DriversRemindMinutesAboutTheirShift','2014-05-26 13:00:00','minute',3,'running','2016-10-17 02:15:00','2016-10-16 12:57:59',900450,'live'),
	(6,'Send Judd Emails for New Users 2pm','Crunchbutton_Cron_Job_NotifyAboutNewUsers','2014-05-29 21:00:00','day',1,'idle','2016-10-17 14:00:00','2016-10-16 14:00:42',870,'live'),
	(7,'Send Judd Emails for New Users 5pm','Crunchbutton_Cron_Job_NotifyAboutNewUsers','2014-05-29 00:00:00','day',1,'idle','2016-10-17 17:00:00','2016-10-16 17:44:57',875,'live'),
	(8,'Send Judd Emails for New Users 8pm','Crunchbutton_Cron_Job_NotifyAboutNewUsers','2014-05-29 03:00:00','day',1,'idle','2016-10-17 20:00:00','2016-10-16 20:00:38',869,'live'),
	(9,'Send Judd Emails for New Users 11pm','Crunchbutton_Cron_Job_NotifyAboutNewUsers','2014-05-29 06:00:00','day',1,'idle','2016-10-17 23:00:00','2016-10-16 23:01:18',870,'live'),
	(10,'Schedule warning - Sent on Sun at 1 PM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-01 20:00:00','week',1,'idle','2016-10-23 21:00:00','2016-10-16 21:44:24',123,'live'),
	(11,'Schedule warning - Sent on Sun at 1 PM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-02 01:00:00','week',1,'idle','2016-10-23 02:00:00','2016-10-16 02:00:47',122,'live'),
	(12,'Schedule warning - Sent on Mon at 10 AM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-02 17:00:00','week',1,'idle','2016-10-17 18:00:00','2016-10-10 18:02:15',120,'live'),
	(13,'Schedule warning - Sent on Mon at 4 PM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-02 23:00:00','week',0,'idle','2016-01-18 00:00:00','2015-12-29 00:01:00',82,'live'),
	(14,'Schedule warning - Sent on Mon at 4:55 PM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-02 23:55:00','week',0,'idle','2016-01-18 00:55:00','2015-12-29 00:55:49',82,'live'),
	(15,'Schedule warning - Sent on Mon at 5 PM PDT','Crunchbutton_Cron_Job_DriversScheduleWarning','2014-06-03 00:00:00','week',0,'idle','2016-01-18 01:00:00','2015-12-29 01:00:09',82,'live'),
	(16,'Send Drivers Schedules #3714 - Wed','Crunchbutton_Cron_Job_DriversShiftWarningWeekly','2014-10-01 17:00:00','week',1,'idle','2016-10-19 18:00:00','2016-10-12 18:00:11',106,'live'),
	(17,'Send Drivers Schedules #3714 - Fri','Crunchbutton_Cron_Job_DriversShiftWarningWeekly','2014-10-04 00:00:00','week',1,'idle','2016-10-23 18:00:00','2016-10-16 18:00:12',107,'live'),
	(18,'Verify the payment status','Crunchbutton_Cron_Job_CheckPaymentStatus','2014-05-26 12:00:00','day',1,'idle','2016-10-17 05:00:00','2016-10-16 05:36:48',717,'live'),
	(19,'Remove pex card funds 2 hours after the shift ends','Crunchbutton_Cron_Job_PexCardFunds','2014-12-03 13:00:00','minute',0,'idle','2015-04-13 12:09:00','2015-04-13 12:06:03',62596,'live'),
	(24,'Check if the card has more than $500','Crunchbutton_Cron_Job_CheckBalanceLimit','2014-12-03 13:00:00','hour',2,'idle','2016-10-17 03:00:00','2016-10-17 01:00:48',7741,'live'),
	(25,'Check if the pexcard transfer had any problem','Crunchbutton_Cron_Job_PexCardTransferErrorCheck','2014-12-03 13:00:00','minute',5,'idle','2016-10-16 01:20:00','2016-10-17 02:10:37',185699,'live'),
	(26,'Load Pex Transactions into our Database','Crunchbutton_Cron_Job_PexLoadTransactions','2014-12-03 13:00:00','hour',2,'idle','2016-10-16 23:57:00','2016-10-17 01:59:17',7566,'live'),
	(27,'Send out any driver notifications that havent sent','Crunchbutton_Cron_Job_DriverFixNotify','2014-05-26 16:00:00','minute',3,'running','2016-10-17 02:15:00','2016-10-16 12:57:59',524680,'live'),
	(28,'Send out any restaurant notifications that havent ','Crunchbutton_Cron_Job_RestaurantFixNotify','2014-05-26 16:00:00','minute',1,'running','2016-10-17 02:13:00','2016-10-16 12:57:59',902140,'live'),
	(32,'Auto shut down communities with no driver','Crunchbutton_Cron_Job_AutoShutDownCommunity','2015-02-03 17:00:00','minute',2,'running','2016-10-17 02:14:00','2016-10-16 12:57:24',372133,'live'),
	(35,'Run rules on orders','Crunchbutton_Cron_Job_OrderRules','2014-05-26 16:00:00','minute',0,'idle','2015-07-22 14:40:00','2015-07-22 14:39:03',17,'live'),
	(40,'mark likely test orders in database','Crunchbutton_Cron_Job_MarkLikelyTestOrders','2015-02-18 13:03:00','minute',10,'idle','2016-10-15 20:33:00','2016-10-17 02:03:34',87014,'live'),
	(42,'Remove pex card funds daily','Crunchbutton_Cron_Job_PexCardFundsDaily','2015-03-24 14:00:00','day',1,'idle','2016-10-17 10:00:00','2016-10-16 10:01:30',570,'live'),
	(48,'Send a digest of all CS tickets since last digest ','Crunchbutton_Cron_Job_CSTicketsDigest','2015-03-24 17:00:00','day',1,'idle','2016-10-17 10:00:00','2016-10-16 10:01:32',564,'live'),
	(54,'Log Smart Eta','Crunchbutton_Cron_Job_LogSmartEta','2015-03-23 17:00:00','minute',0,'idle','2015-12-24 18:01:00','2015-12-24 18:00:17',344933,'live'),
	(60,'Executes the drivers scheduled payments','Crunchbutton_Cron_Job_PayDrivers','2015-03-23 17:00:00','minute',10,'idle','2016-10-16 01:25:00','2016-10-17 02:06:03',76817,'live'),
	(63,'Check Pex Card Status','Crunchbutton_Cron_Job_CheckPexCardApiStatus','2015-03-23 17:00:00','minute',0,'idle','2015-05-01 15:24:00','2015-05-01 22:21:03',304,'live'),
	(69,'Monitor log table ','Crunchbutton_Cron_Job_LogMonitor','2015-03-23 17:00:00','minute',10,'idle','2016-10-16 16:00:00','2016-10-17 02:10:42',70818,'live'),
	(71,'Community closed messages ','Crunchbutton_Cron_Job_CommunityClosedMessage','2015-06-08 23:13:00','minute',10,'idle','2016-10-16 19:53:00','2016-10-17 02:03:39',70084,'live'),
	(74,'Creates support ticket for not geomatched orders','Crunchbutton_Cron_Job_TicketForNotGeomatchedOrders','2014-06-09 09:00:00','minute',1,'running','2016-10-17 02:13:00','2016-10-16 12:57:59',454536,'live'),
	(77,'Keeps the phone table updated','Crunchbutton_Cron_Job_UpdatePhoneTable','2014-06-15 20:00:00','minute',0,'idle','2015-08-31 20:36:00','2015-08-31 20:06:06',7338,'live'),
	(80,'Executes the restaurants scheduled payments','Crunchbutton_Cron_Job_PayRestaurants','2015-07-27 10:00:00','minute',10,'idle','2016-10-16 16:00:00','2016-10-17 02:10:43',175624,'live'),
	(83,'Check for unverified accounts and auto-reverify th','Crunchbutton_Cron_Job_VerifyDriverAccount','2015-07-30 17:00:00','week',1,'idle','2016-10-20 10:00:00','2016-10-13 10:01:08',63,'live'),
	(86,'Smart population of \"our most popular locations\"','Crunchbutton_Cron_Job_SmartCommunitySortPopulation','2015-07-27 17:00:00','day',1,'idle','2016-10-17 10:00:00','2016-10-16 10:01:34',432,'live'),
	(95,'Temp cron to change the referral codes #5321','Crunchbutton_Cron_Job_TempReferralCode','2015-08-31 20:25:00','minute',0,'idle','2015-09-02 11:35:00','2015-09-02 11:25:04',236,'live'),
	(110,'Session garbage collection','Crunchbutton_Cron_Job_SessionGc','2015-11-20 16:00:00','minute',30,'idle','2016-10-15 21:01:00','2016-10-17 02:01:46',19390,'live'),
	(111,'Pre process Pex Report','Crunchbutton_Cron_Job_PexPreProcessReport','2015-12-08 13:00:00','minute',30,'idle','2016-10-17 00:56:00','2016-10-17 01:56:55',14575,'live'),
	(113,'Creates support ticket for not campus cash orders','Crunchbutton_Cron_Job_TicketForCampusCashOrders','2015-12-09 09:00:00','minute',0,'idle','2016-04-18 12:42:00','2016-04-18 12:39:07',55532,'live'),
	(115,'Process preordered ordes','Crunchbutton_Cron_Job_ProcessPreOrder','2015-12-17 09:00:00','minute',1,'running','2016-10-17 02:13:00','2016-10-16 12:58:00',383692,'live'),
	(117,'Create a new pexcard token every 10 days','Crunchbutton_Cron_Job_CreatePexCardToken','2016-02-12 09:00:00','day',10,'idle','2016-10-19 09:00:00','2016-10-09 09:00:12',25,'live'),
	(118,'Create GitHub Issues for Material Refil','Crunchbutton_Cron_Job_MarketingMaterialsRefil','2016-04-14 18:00:00','day',1,'idle','2016-10-17 18:00:00','2016-10-16 18:00:18',194,'live'),
	(119,'Community notification','Crunchbutton_Cron_Job_CommunityNotification','2016-06-01 18:00:00','minute',1,'running','2016-10-17 02:13:00','2016-10-16 12:58:00',192671,'live'),
	(120,'Support Action','Crunchbutton_Cron_Job_SupportAction','2016-10-04 21:00:00','minute',0,'idle','2016-10-10 18:26:00','2016-10-10 18:25:07',8469,'live');
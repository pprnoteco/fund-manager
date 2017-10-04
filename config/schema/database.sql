USE `funds`;

DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `attachments`;
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `funds`;
DROP TABLE IF EXISTS `investments`;
DROP TABLE IF EXISTS `investors`;
DROP TABLE IF EXISTS `offerings`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `investor_id` int(10) unsigned DEFAULT NULL,
  `type` int(5) unsigned DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `investments_count` int(11) DEFAULT '0',
  `investments_amount` decimal(15,2) DEFAULT '0.00',
  `investments_balance` decimal(15,2) DEFAULT '0.00',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=880 DEFAULT CHARSET=utf8;

CREATE TABLE `attachments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent` varchar(250) DEFAULT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `path` varchar(250) DEFAULT NULL,
  `mime` varchar(250) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent` varchar(250) DEFAULT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `content` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

CREATE TABLE `funds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `investments_count` int(11) DEFAULT '0',
  `investments_amount` decimal(15,2) DEFAULT '0.00',
  `investments_balance` decimal(15,2) DEFAULT '0.00',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

CREATE TABLE `investments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `offering_id` int(10) unsigned DEFAULT NULL,
  `account_id` int(10) unsigned DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `rollover` tinyint(1) unsigned DEFAULT '0',
  `date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `term` int(5) DEFAULT '36',
  `maturity` date DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT NULL,
  `preferred_payment` decimal(15,2) DEFAULT NULL,
  `status` int(5) DEFAULT NULL,
  `closed` date DEFAULT NULL,
  `ach` tinyint(1) unsigned DEFAULT NULL,
  `ach_bank` varchar(250) DEFAULT NULL,
  `ach_routing` varchar(250) DEFAULT NULL,
  `ach_account` varchar(250) DEFAULT NULL,
  `ach_type` int(10) unsigned DEFAULT NULL,
  `statements_start` date DEFAULT NULL,
  `statements_end` date DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=927 DEFAULT CHARSET=utf8;

CREATE TABLE `investors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ftp_folder` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` char(2) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `investments_count` int(11) DEFAULT NULL,
  `investments_amount` decimal(15,2) DEFAULT NULL,
  `investments_balance` decimal(15,2) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=457 DEFAULT CHARSET=utf8;

CREATE TABLE `offerings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fund_id` int(10) unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `class` varchar(10) DEFAULT NULL,
  `rate` decimal(10,5) DEFAULT NULL,
  `capacity` decimal(15,2) DEFAULT NULL,
  `investments_count` int(11) DEFAULT '0',
  `investments_amount` decimal(15,2) DEFAULT '0.00',
  `investments_balance` decimal(15,2) DEFAULT '0.00',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

CREATE TABLE `statements` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `investment_id` int(10) unsigned DEFAULT NULL,
  `correct` tinyint(1) DEFAULT '1',
  `date` date DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22912 DEFAULT CHARSET=utf8;

CREATE TABLE `transactions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `investment_id` int(10) unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `type` int(5) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by_id` int(10) unsigned DEFAULT NULL,
  `modified_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14589 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `active` tinyint(1) DEFAULT '0',
  `locked` tinyint(1) DEFAULT '0',
  `token` char(36) DEFAULT NULL,
  `token_type` varchar(50) DEFAULT NULL,
  `username` varchar(250) DEFAULT NULL,
  `password` varchar(250) DEFAULT NULL,
  `role` int(5) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

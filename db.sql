CREATE TABLE `data` (
`id` int(10) unsigned NOT NULL,
  `prolificid` varchar(128) NOT NULL,
  `ipaddress` varchar(128) DEFAULT NULL,
  `browser` varchar(128) DEFAULT NULL,
  `platform` varchar(128) DEFAULT NULL,
  `condition` int(11) DEFAULT NULL,
  `counterbalance` int(11) DEFAULT NULL,
  `codeversion` varchar(128) DEFAULT NULL,
  `begin` datetime DEFAULT NULL,
  `beginexp` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `datastring` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for table `data`
--
ALTER TABLE `data`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `uniqueid` (`prolificid`);

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;
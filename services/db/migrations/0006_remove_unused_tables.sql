-- drop unused tables
DROP TABLE IF EXISTS `mugdialog`;
DROP TABLE IF EXISTS `rideidea`;
RENAME TABLE `mugDialog` TO `mugdialog`;
RENAME TABLE `rideIdea` TO `rideidea`;

drop database if exists `scms`;
create database `scms`;

CREATE TABLE `scms`.`customers` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `state` VARCHAR(45) NOT NULL,
  `zip` MEDIUMINT NOT NULL,
  PRIMARY KEY (`ID`));
  
CREATE TABLE `scms`.`passwords` (
  `ID` INT NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `password`
    FOREIGN KEY (`ID`)
    REFERENCES `scms`.`customers` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `scms`.`contact_numbers` (
  `ID` INT NOT NULL,
  `phoneNumber` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`ID`, `phoneNumber`),
  CONSTRAINT `ID`
    FOREIGN KEY (`ID`)
    REFERENCES `scms`.`customers` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


CREATE TABLE `scms`.`products` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `imagePath` VARCHAR(150),
  `details` VARCHAR(1000),
  `capacityConsumption` MEDIUMINT NOT NULL,
  `price` DECIMAL(8,2) NOT NULL,
  `discount` DECIMAL(8,2) DEFAULT 0,
  PRIMARY KEY (`ID`));


CREATE TABLE `scms`.`routes` (
  `routeID` INT NOT NULL AUTO_INCREMENT,
  `startingCity` VARCHAR(50),
  `endingCity` VARCHAR(50),
  `travelTime` DECIMAL(3,0),
  PRIMARY KEY (`routeID`));


CREATE TABLE `scms`.`cities` (
  `routeID` INT NOT NULL,
  `city` VARCHAR(45) NULL,
  `distance` SMALLINT NULL,
  PRIMARY KEY (`routeID`),
  CONSTRAINT `routeID`
    FOREIGN KEY (`routeID`)
    REFERENCES `scms`.`routes` (`routeID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


CREATE TABLE `scms`.`order_status` (
  `trackingNO` SMALLINT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`trackingNO`));


CREATE TABLE `scms`.`orders` (
  `orderID` INT NOT NULL AUTO_INCREMENT,
  `customerID` INT NOT NULL,
  `productID` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `quantity` SMALLINT NOT NULL,
  `routeID` MEDIUMINT NULL,
  `trackingNO` SMALLINT NULL,
  PRIMARY KEY (`orderID`),
  INDEX `customer_idx` (`customerID` ASC) VISIBLE,
  INDEX `product_idx` (`productID` ASC) VISIBLE,
  INDEX `tracking_idx` (`trackingNO` ASC) VISIBLE,
  CONSTRAINT `customer`
    FOREIGN KEY (`customerID`)
    REFERENCES `scms`.`customers` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `product`
    FOREIGN KEY (`productID`)
    REFERENCES `scms`.`products` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `tracking`
    FOREIGN KEY (`trackingNO`)
    REFERENCES `scms`.`order_status` (`trackingNO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `scms`.`stores` (
  `storeID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`storeID`));


CREATE TABLE `scms`.`order_in_store` (
  `orderID` INT NOT NULL,
  `storeID` INT NOT NULL,
  PRIMARY KEY (`orderID`),
  CONSTRAINT `order`
    FOREIGN KEY (`orderID`)
    REFERENCES `scms`.`orders` (`orderID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `scms`.`trucks` (
  `licenseID` VARCHAR(10) NOT NULL,
  `storeID` INT NOT NULL,
  PRIMARY KEY (`licenseID`),
  CONSTRAINT `truckStore`
    FOREIGN KEY (`storeID`)
    REFERENCES `scms`.`stores` (`storeID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `scms`.`employees` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `address` VARCHAR(250) NOT NULL,
  `position` ENUM('driver','assistant', 'manager'),
  `branch` VARCHAR(25),
  PRIMARY KEY (`ID`));
  
CREATE TABLE `scms`.`log` (
  `employeeID` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`employeeID`, `date`),
  CONSTRAINT `employee`
    FOREIGN KEY (`employeeID`)
    REFERENCES `scms`.`employees` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
CREATE TABLE `scms`.`truck_schedule` (
  `scheduleID` INT NOT NULL AUTO_INCREMENT,
  `truckID` VARCHAR(10),
  `routeID` INT NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `driver` INT NULL,
  `driverAssistant` INT NULL,
  PRIMARY KEY (`scheduleID`),
  INDEX `scheduleTruck_idx` (`truckID` ASC) VISIBLE,
  INDEX `scheduleRoute_idx` (`routeID` ASC) VISIBLE,
  CONSTRAINT `scheduleTruck`
    FOREIGN KEY (`truckID`)
    REFERENCES `scms`.`trucks` (`licenseID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `scheduleRoute`
    FOREIGN KEY (`routeID`)
    REFERENCES `scms`.`routes` (`routeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `scheduleDriver`
    FOREIGN KEY (`driver`)
    REFERENCES `scms`.`employees` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `scheduleAssistant`
    FOREIGN KEY (`driverAssistant`)
    REFERENCES `scms`.`employees` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `scms`.`truck_packages` (
  `scheduleID` INT NOT NULL,
  `orderID` INT NOT NULL,
  PRIMARY KEY (`scheduleID`, `orderID`),
  INDEX `packageOrder_idx` (`orderID` ASC) VISIBLE,
  CONSTRAINT `packageSchedule`
    FOREIGN KEY (`scheduleID`)
    REFERENCES `scms`.`truck_schedule` (`scheduleID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `packageOrder`
    FOREIGN KEY (`orderID`)
    REFERENCES `scms`.`orders` (`orderID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `scms`.`train_schedule` (
  `scheduleID` INT NOT NULL AUTO_INCREMENT,
  `trainNumber` VARCHAR(20) NOT NULL,
  `_from` VARCHAR(50) NOT NULL,
  `_to` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `allocatedCapacity` INT NOT NULL,
  PRIMARY KEY (`scheduleID`));


CREATE TABLE `scms`.`train_package` (
  `scheduleID` INT NOT NULL,
  `orderID` INT NOT NULL,
  PRIMARY KEY (`scheduleID`, `orderID`),
  INDEX `trainOrder_idx` (`orderID` ASC) VISIBLE,
  CONSTRAINT `trainSchedule`
    FOREIGN KEY (`scheduleID`)
    REFERENCES `scms`.`train_schedule` (`scheduleID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `trainOrder`
    FOREIGN KEY (`orderID`)
    REFERENCES `scms`.`orders` (`orderID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

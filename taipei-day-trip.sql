CREATE DATABASE taipei_day_trip;
USE taipei_day_trip;
# 存放浮點數可以用FLOAT可以存放小數點後7個位數，DOUBLE可以存到小數點以下15個位數
CREATE TABLE attractions(
	id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique ID',
    name VARCHAR(255) NOT NULL COMMENT 'Name',
	category VARCHAR(255) NOT NULL COMMENT 'Category',
    description TEXT NOT NULL COMMENT 'Description',
	address VARCHAR(255) NOT NULL COMMENT 'Address',
    transport TEXT NOT NULL COMMENT 'Transport',
    mrt VARCHAR(255)  COMMENT 'MRT',
    lat DOUBLE NOT NULL COMMENT 'Latitude',
    lng DOUBLE NOT NULL COMMENT 'Longitude'
);

CREATE TABLE attractions_images(
	id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Images id',
    attractions_id INT NOT NULL COMMENT 'Attractions id for images',
    url VARCHAR(255) NOT NULL COMMENT 'Images url',
    FOREIGN KEY (attractions_id) REFERENCES attractions(id)
);
SHOW TABLES;
SELECT * FROM attractions;
SELECT * FROM attractions_images;
SET SQL_SAFE_UPDATES=0;
# DROP TABLE attractions;
# DROP TABLE attractions_images;

SELECT COUNT(*) FROM  attractions WHERE name="劍潭" OR mrt LIKE '%劍潭%' ORDER BY id ASC;
SELECT * FROM attractions WHERE name="劍潭" OR mrt LIKE '%劍潭%' ORDER BY id ASC LIMIT 0, 12;
SELECT COUNT(id) FROM  attractions;
SELECT mrt,COUNT(mrt) FROM attractions GROUP BY mrt ORDER BY COUNT(mrt) DESC;
SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',') 
	as images FROM attractions LEFT JOIN attractions_images  
    ON attractions.id=attractions_images.attractions_id  
    WHERE mrt="劍潭" OR name LIKE '%劍潭%' GROUP BY attractions.id 
    ORDER BY attractions.id ASC LIMIT 0, 12;
SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',')
as images FROM attractions LEFT JOIN attractions_images  
ON attractions.id=attractions_images.attractions_id WHERE attractions.id=1;

SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',')
		as images FROM attractions LEFT JOIN attractions_images  ON attractions.id=attractions_images.attractions_id 
		 GROUP BY attractions.id ORDER BY attractions.id ASC LIMIT 0, 12;
select count(*) from attractions;
CREATE TABLE user(
	id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique ID',
    name VARCHAR(255) NOT NULL COMMENT 'Name',
	email VARCHAR(255) NOT NULL COMMENT 'Email',
    password VARCHAR(255) NOT NULL COMMENT 'Password'
    );
select * from user;
INSERT INTO user(id,name,email,password) VALUES (1,"aaa","aaa","aaa");
SELECT * FROM user WHERE email="bbb";
DROP TABLE user;
CREATE TABLE booking(
	id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique ID',
    user_id INT NOT NULL UNIQUE COMMENT 'User ID',
    attraction_id INT COMMENT 'Attraction ID',
    date VARCHAR(255) NOT NULL COMMENT 'Date',
    time VARCHAR(255) NOT NULL COMMENT 'Time',
    price INT NOT NULL COMMENT 'Price',
    FOREIGN KEY (attraction_id) REFERENCES attractions(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
DROP TABLE booking;
SELECT * FROM booking;
SELECT booking.*,attractions.name, attractions.address, MIN(attractions_images.url) 
	FROM booking LEFT JOIN attractions ON booking.attraction_id=attractions.id 
    LEFT JOIN attractions_images ON booking.attraction_id=attractions_images.attractions_id
    WHERE booking.user_id = 1
    GROUP BY booking.id, attractions.id;
DELETE FROM booking WHERE user_id=2;

CREATE TABLE orders(
	id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Unique ID',
    order_no VARCHAR(255) COMMENT 'Order ID',
    user_id INT NOT NULL COMMENT 'User ID',
    attraction_id INT NOT NULL COMMENT 'Attraction ID',
    date VARCHAR(255) NOT NULL COMMENT 'Date',
    time VARCHAR(255) NOT NULL COMMENT 'Time',
    price INT NOT NULL COMMENT 'Price',
    contact_name VARCHAR(255) NOT NULL COMMENT 'Contact Name',
    contact_email VARCHAR(255) NOT NULL COMMENT 'Contact Email',
    contact_phone VARCHAR(255) NOT NULL COMMENT 'Contact Phone',
    pay VARCHAR(255) DEFAULT 'no' COMMENT 'Pay',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attraction_id) REFERENCES attractions(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);
DROP TABLE orders;
SELECT * from orders;

INSERT INTO orders (user_id, attraction_id, date, time, price, contact_name, contact_email, contact_phone) 
	VALUES(2,2,"2025-04-25","afternoon",2500,"哈哈","melody@melody.com",0905470420);
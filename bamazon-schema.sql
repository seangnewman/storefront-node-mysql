create database bamazon;

use bamazon;
 
 create table products(
 item_id int(6) auto_increment
 ,product_name varchar(255) not null
 ,department_name varchar(255) null
 ,price decimal(16) not null
 ,stock_quantity int(10) not null
 ,primary key (item_id)
 );
 
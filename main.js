// Need to import the env file for the password
//npm install dotenv --save
var dotenv = require("dotenv").config();
//Import mySQL functionality
//npm i promise-mysql
var mySQL = require('promise-mysql');

 
//npm i cli-table
var Table = require('cli-table');


//Need to ask questions
var inquirer = require('inquirer-promise');


mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
}).then(function(conn){
    // do stuff with conn
    // First query the database
    connection = conn;
    var queryString = 'select * from products';
    var rs = connection.query(queryString)
    
    connection.end();
    //conn.end();
    return rs;


}).then(function(rows){
    //console.log("ID\tProduct\t\tDepartment\tPrice\tQuantity");


    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
      , colWidths: [5, 35, 35, 10, 10]
    });
    for(var i in rows){
        //console.log(`${rows[i].item_id}\t${rows[i].product_name}\t${rows[i].department_name}
        //\t${rows[i].price}\t${rows[i].stock_quantity}`);
        var rowArray = [rows[i].item_id, rows[i].product_name, rows[i].department_name, rows[i].price, rows[i].stock_quantity];
        table.push(rowArray);
         
    }
   console.log(table.toString());

   var productObj = {
    type : 'input',
    name : 'product_id',
    message : 'Which item id would you like to purchase?'

};

   inquirer.prompt([productObj])
  .then(results => console.log(results.product_id));
    
}).done();


// Ok, now the inventory is displayed.  What does the customer want"
// Declare object to handle first question

 
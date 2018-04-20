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

/*
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
    
   var bProducts = []
   for( var i=0; i < rows.length; i++){
        var productionObject = {
            name: rows[i].product_name,
            value : rows[i].price,
            short : rows[i].product_id
        };

        bProducts.push(productionObject);
   }

   var productObj = {
    type : 'list',
    name : 'product_id',
    message : 'Which item id would you like to purchase?',
    choices : bProducts

};
    console.log(rows);

   inquirer.prompt([productObj])
  .then(results => console.log(results.product_id));
    
}).done();
*/

function customerDisplay(){
  //Create a connection to the database
  mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  }).then(function(conn){
    // We have a connection, display inventory to the user
    connection = conn;
    var queryString = 'select * from products';
    var rs = connection.query(queryString)
    connection.end();
    // Return result set for processing
    return rs;
  }).then(function(rows){

    //Create a table, set the heading fields and assign column widths
    var table = new Table({
      head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
      ,colWidths: [5, 35, 35, 10, 10]
    });

    // Holds the product attributes for display to user
    var bProducts = [];
    
    for(var i in rows){
      // Each row will be transferred to a separate array and pushed to the table  
      var rowArray = [rows[i].item_id, rows[i].product_name, rows[i].department_name, rows[i].price, rows[i].stock_quantity];
      table.push(rowArray);
    }
    //Display table t user
    console.log(table.toString());


       for( var i=0; i < rows.length; i++){
            var productionObject = {
                name  : rows[i].item_id + " " + rows[i].product_name,
                short : rows[i].item_id,
                //value : rows[i].stock_quantity +":" +rows[i].price
            };
    
            bProducts.push(productionObject);
       }
    
       var productObj = {
        type : 'list',
        name : 'productID',
        message : 'Which item id would you like to purchase?',
        choices : bProducts,
        pageSize : 10,
        prefix :"What?"
    
    };
        
    
       inquirer.prompt([productObj])
      .then(results => console.log(results.productID));
        
    })
}

// Ok, now the inventory is displayed.  What does the customer want"
// Declare object to handle first question

 function bCustomer(){
     //Display the current inventory
     customerDisplay();
 }


 // Run the application
 bCustomer();
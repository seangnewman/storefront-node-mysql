// Need to import the env file for the password
var dotenv = require("dotenv").config();
//Import mySQL functionality
var mySQL = require('promise-mysql');
 
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
    console.log("ID\tProduct\t\tDepartment\tPrice\tQuantity");
    for(var i in rows){
        console.log(`${rows[i].item_id}\t${rows[i].product_name}\t${rows[i].department_name}
        \t${rows[i].price}\t${rows[i].stock_quantity}`);
         
    }
    //console.log(rows);
    
});

 
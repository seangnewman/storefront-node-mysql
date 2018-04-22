 
// Need to import the env file to retrieve database settings
//npm install dotenv --save
var dotenv = require("dotenv").config();

//Import mySQL functionality
//npm i promise-mysql
var mySQL = require('promise-mysql');

//Using the CLI table 
//npm i cli-table
var Table = require('cli-table');

//Prompt user for questions
  var inquirer = require('inquirer-promise');

  //Create a connection to the database
  var bAmazonConnect = mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });

  var displayTable = function(tableRows){
    var table = tableHeader();
    // Holds the product attributes for display to user
    for(var i in tableRows){
      // Each row will be transferred to a separate array and pushed to the table  
      var rowArray = [tableRows[i].item_id, tableRows[i].product_name, tableRows[i].department_name, tableRows[i].price, tableRows[i].stock_quantity];
      table.push(rowArray);
    }

    //Let's clear the display
    process.stdout.write('\033c');
    //And display the tab;e
    console.log(table.toString());
  };

  function productDisplay(prodIndex){
    bAmazonConnect.then(function(conn){
      var connection = conn;
      var queryString = `SELECT  * FROM products WHERE item_id = ${prodIndex} AND stock_quantity > 0`;
      var rs = connection.query(queryString);
     
      //connection.end();
      return rs;
      }).then(function(rows){
      displayItem(rows[0]);
    }).then(function(item){
    //connection.end();
    }).done(function(){
      //connection.end();
    })
  }
  
  function purchasedItem(row){
    var table = tableHeader();
    table.push(row);
    console.log(table.toString());
   }

  
 function tableHeader(){
    var tblHeader = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
        ,colWidths: [5, 35, 35, 10, 10]
      });
      return tblHeader;  
 }

 function returnProducts(prodRows){
   var bProducts = [];
   for( var i=0; i < prodRows.length; i++){
     var productionObject = {
       name  : prodRows[i].item_id + " " + prodRows[i].product_name,
       short : prodRows[i].item_id,
    };
   bProducts.push(productionObject);
  }
  return bProducts;
 }

  function validateInput(value) {
    var inputValue = Number.isInteger(parseFloat(value));
      if (inputValue && (value > 0)) {
	    return true;
	  } else {
	    return 'Please enter a valid quantity';
	  }
  }

  function promptForProduct(productArray){
    var productObj = {
      type : 'list',
      name : 'productID',
      message : 'Which item id would you like to purchase?',
      choices : productArray,
      pageSize : 10,
      
    };
  
    var productVolume = {
      type : 'input',
      name : 'volume',
      message : 'How many items would you like?',
      validate : validateInput,
      filter :Number
    };
  
    var promptIndex =  inquirer.prompt([productObj,  productVolume]).then(function(list){
      //console.log(list);
      var prodArray = list.productID.split(' ');
      var reqItem = prodArray[0];
      var reqDesc = prodArray[1];
      var reqVolume = list.volume;
      //query the products table for the volume and price
      var queryString = `SELECT item_id, product_name as Product, department_name, price * ${reqVolume} as Cost, stock_quantity as Quantity from products where item_id = ${reqItem}`;
    
      bAmazonConnect.then(function(conn){
        connection = conn;
         var rs = connection.query(queryString);
         return rs;
      }).then(function(rows){
        itemPrice = rows[0].Price;
        itemQuantity = parseInt(rows[0].Quantity);
        itemCost = parseFloat(rows[0].Cost);
        itemDept = rows[0].department_name;
        itemTotalCost = parseFloat(reqVolume) * parseFloat(itemCost);
        
        if(parseInt(reqVolume) <= itemQuantity ){
          //Display purchased item 
          var purchasedItemDetails = [reqItem, reqDesc, itemDept, itemCost, reqVolume];
          purchasedItem(purchasedItemDetails);
          //It's all good, fulfill order
          var successMessage = `\nPlacing your order of ${reqDesc}'s.  Your total cost is ${itemCost} units\n\n`;
          //Now let's update the table
          updateInventory((itemQuantity - reqVolume), reqItem )
          console.log(successMessage);
        }else{
          var failureMessage = `\nUnfortunately your request has exceeded the number of ${reqDesc}'s in our inventory.  Please update your order as the maximum number of items is ${itemQuantity}.\n\n`;
          console.log(failureMessage);
        }
      }).then(function(){
         //connection.end();
         setTimeout(customerDisplay, 3000);
      }).then(function(){
      });
    }).then();
  }

  function updateInventory(quantity, itemID){
    var queryString = `update products set stock_quantity = ${quantity} where item_id = ${itemID}`;
    bAmazonConnect.then(function(conn){
     // We have a connection, display inventory to the user
      connection = conn;
      var rs = connection.query(queryString);
      // Return result set for processing
      return rs;
    }).then(function(rows){
       console.log("Order has been placed\n");
    }).then(function(){
      //connection.end();
    });
  }
  
function customerDisplay(){
  var queryString = 'SELECT * from products where stock_quantity > 0';
  bAmazonConnect.then(function(conn){
  // We have a connection, display inventory to the user
  connection = conn;
  var rs = connection.query(queryString);
  // Return result set for processing
   return rs;
  }).then(function(rows){
  displayTable(rows);
  promptForProduct(returnProducts(rows));
   }).then(function(){
      //connection.end();
  })
}

//Run the customer inventory
function bCustomer(){
    //Display the current inventory
    customerDisplay();
}

// Run the application
 bCustomer();
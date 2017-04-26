var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "Bamazon"
});


connection.connect(function(err) {
    if (err) throw err;

});

connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    itemChoice();

});



var itemChoice = function() {
    inquirer.prompt([{

        name: "item",
        message: "what is the id number of the item you would like to buy?"
    }, {
        name: "quantity",
        type: "input",
        message: "How many would like to buy from this item?"

    }]).then(function(answer) {
        console.log("You Selected:" + answer.item);
        var query = "SELECT * FROM products WHERE item_id=?";
        connection.query(query, [answer.item],
            function(err, res) {
                console.log("Selected Item:" + res[0].product_name);
                //console.log(answer.quantity);
                //console.log(res[0].stock_quantity);
                if ([answer.quantity] <= res[0].stock_quantity) {

                    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [answer.quantity, answer.item],
                        function(err, res) {
                            if (err) throw err;
                        });
                    console.log("You got it");
                    console.log("database updated");
                } else {
                    console.log("Insufficient quantity!");
                }
            });
    });

};

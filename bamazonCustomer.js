var Database = require('better-sqlite3')
var inquirer = require('inquirer')

var db = new Database('./bamazon.db')



function showItems(){
    var rows = db.prepare('select * from products').all()

    for (var i = 0; i < rows.length; i++){ 
        var row = rows[i]
        console.log(
            row.item_id,
            row.product_name,
            row.department_name,
            '$' + row.price, 
            row.stock_quantity
        )
    }   
}

function run() {
    inquirer.prompt([
        {name: 'id', message: "Please enter the ID of the item you want to buy"},
        {name: 'stock', message: "How many would you like?"}
    ]).then(answers => {
        row = db.prepare('select * from products where item_id=' + answers.id).get()

        if (parseInt(answers.stock) > row.stock_quantity) {
            console.log("Insufficient Quantity")
            run()
        }else{
            console.log("This transaction costs $", row.price * parseInt(answers.stock))

            db.prepare('update products set stock_quantity=' + (row.stock_quantity - parseInt(answers.stock))).run()
            showItems()
            run()
        } 
        
    })
}


console.log("These are the items for sale and their quantities")
showItems()
run()

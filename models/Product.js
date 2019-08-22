//Require Sequelize package to parse data types
const dataType = require("sequelize");
//Reauire database connection
const sequelize = require("../config/config.js");

//Make a new sequelize model
const Product = sequelize.define("Product", {
    product_name: { type: dataType.STRING, allowNull: false },
    department_name: { type: dataType.STRING, allowNull: false },
    price: { type: dataType.INTEGER, allowNull: false },
    stock_quantity: { type: dataType.INTEGER, allowNull: false }
});

// Sync with the table, if no table, create one
Product.sync()

//Export for api-routs.js
module.exports = Product;
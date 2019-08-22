const Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize
const sequelize = new Sequelize("sequelize_library", "root", "funfunfun", {
	host: "localhost",
	port: 3306,
	dialect: "mysql"
});

// Exports the connection for Product.js to use
module.exports = sequelize;
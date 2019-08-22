//Require model usage
const Products = require("../models/Product.js");

//Exports function for server.js to use
module.exports = function(app) {
    app.get("/api/products", (req, res) => {
        res.json("all products here");
    });
}; 
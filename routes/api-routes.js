//Require model usage
const db = require("../models");

//Exports function for server.js to use
module.exports = function(app) {
    app.get("/api/products", (req, res) => {
        db.Product.findAll({}).then(data => {
            if (data) res.json(data)
            else res.status(404).json( { message: "Not Found" } );
        })
    });

    app.get("/api/products/:product_name", (req, res) => {
        const product = req.params.product_name;
        db.Product.findOne({ where: { product_name: product }}).then(data => {
            if (data) res.json(data)
            else res.status(404).json( { message: "Not Found" } );
        });
    });

    app.get("/api/departments/:department_name", (req, res) => {
        const department = req.params.department_name;
        db.Product.findAll({ where: { department_name: department }}).then(data => {
            if (data) res.json(data)
            else res.status(404).json( { message: "Not Found" } );
        });
    });

    // Post Requests
    app.post("/api/products", (req, res) => {
        console.log(req.body)
        db.Product.create(req.body).then(data => res.json({message: "Success!"}));
    });
}; 
//Require model usage
const Product = require("../models/Product.js");

//Exports function for server.js to use
module.exports = function(app) {
    app.get("/api/products", (req, res) => {
        Product.findAll().then(data => {
            if (data) res.json(data)
            else res.status(404).json( { message: "Not Found" } );
        })
    });

    app.get("/api/products/:product_name", (req, res) => {
        const product = req.params.product_name;
        Product.findOne({ where: { product_name: product }}).then(data => {
            if (data) { 
                res.json(data)
            } else { 
                res.status(404).json( { message: "Not Found" } )
            };
        });
    });

    app.get("/api/departments/:department_name", (req, res) => {
        const department = req.params.department_name;
        Product.findAll({ where: { department_name: department }}).then(data => {
            if (data) { 
                res.json(data)
            } else { 
                res.status(404).json( { message: "Not Found" } )
            };
        });
    });


    app.post("/api/products", (req, res) => {
        console.log(req.body)
        Product.create(req.body).then(data => res.json({message: "Success!"}));
    });
}; 
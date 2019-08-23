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

    app.get("/api/products/:id", (req, res) => {
        db.Product.findOne({ where: { id: req.params.id }}).then(data => {
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
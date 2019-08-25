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

    // Put requests for updating quantity
    app.put("/api/products/:id/quantity", (req, res) => {
        db.Product.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        }).catch(function (err) {
            res.json({message: err});
        });
    });

    // Put requests for updating price
    app.put("/api/products/:id/price", (req, res) => {
        db.Product.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        }).catch(function (err) {
            res.json({message: err});
        });
    });

    // Post Requests
    app.post("/api/products", (req, res) => {
        console.log(req.body)
        db.Product.create(req.body).then(data => res.json({message: "Success!"}));
    });
}; 
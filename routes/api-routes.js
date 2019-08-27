//Require model usage
const db = require("../models");

//Exports function for server.js to use
module.exports = function (app) {
    app.get("/api/products", (req, res) => {
        db.Product.findAll({}).then(data => {
            if (data) res.json(data)
            else res.status(404).json({ message: "Not Found" });
        })
    });

    app.get("/api/products/:id", (req, res) => {
        db.Product.findOne({ where: { id: req.params.id } }).then(data => {
            if (data) res.json(data)
            else res.status(404).json({ message: "Not Found" });
        });
    });

    // Get all products by department
    app.get("/api/products/department/:id", (req, res) => {
        db.Product.findAll({ where: { DepartmentId: req.params.id } }).then(data => {
            if (data) res.json(data)
            else res.status(404).json({ message: "Not Found" });
        });
    });

    // Put requests for updating products
    app.put("/api/products/id/:id", (req, res) => {
        db.Product.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        }).catch(function (err) {
            res.json({ message: err });
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
            res.json({ message: err });
        });
    });

    // Post Requests
    app.post("/api/products", (req, res) => {
        console.log(req.body)
        db.Product.create(req.body).then(data => res.json({ message: "Success!" }));
    });

    // Delete requests for deleting item
    app.delete("/api/products/id/:id", (req, res) => {
        console.log("Going to delete " + req.params.id);
        db.Product.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        });
    });

    // Departments

    // Get all departments
    app.get("/api/departments", (req, res) => {
        db.Department.findAll({ include: [db.Product] }).then(data => {
            if (data) res.json(data)
            else res.status(404).json({ message: "Not Found" });
        })
    });

    // add departments
    app.post("/api/departments", (req, res) => {
        db.Department.create(req.body).then(data => {
            if (data) res.json({ message: "Success!" })
        });
    });

    // Get all departments by ID
    app.get("/api/departments/id/:id", (req, res) => {
        db.Department.findAll({ where: { id: req.params.id }, include: [db.Product] }).then(data => {
            if (data) res.json(data)
            else res.status(404).json({ message: "Not Found" });
        })
    });

    // Update existing departments
    app.put("/api/departments/id/:id", (req, res) => {
        db.Department.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(data => {
            if (data) res.json(data);
            else res.status(404).json({ message: "Not Valid!" });
        })
    });

    // Delete requests for deleting item
    app.delete("/api/departments/id/:id", (req, res) => {
        console.log("Deleting department %s", req.params.id);
        db.Department.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.end();
        });
    });
}; 
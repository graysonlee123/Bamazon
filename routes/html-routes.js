const path = require("path");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/cart", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/cart.html"));
    });

    app.get("/product", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/product.html"));
    });

    app.get("/manager", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/manager.html"));
    });

    app.get("/supervisor", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/supervisor.html"));
    });
};
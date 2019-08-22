const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

const db = require("./models");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve public folder
app.use(express.static("public"));

//Serve API routes 
require("./routes/api-routes.js")(app);

//Serve HTML routes
require("./routes/html-routes.js")(app);

// Sync tables and start server
// On development environments, use sync({force: true})
db.sequelize.sync({ force: true }).then(function () {
	app.listen(PORT, function () {
		console.log("App listening on PORT " + PORT);
	});
});
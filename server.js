const express = require("express");
const app = express();

const PORT = 8080;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve public folder
app.use(express.static("public"));

//Serve API routes 
require("./routes/api-routes.js")(app);

//Serve HTML routes
require("./routes/html-routes.js")(app);

app.listen(PORT, () => console.log("Listening on port " + PORT) );
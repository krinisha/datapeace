const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 4040;

//Connecting to MongoDB Atlas Cluster
var configDB = require("./config/database.js");
const options = {
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
    useNewUrlParser: true
};
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(
    configDB.mongoDB.url,
    options,
    error => {
        if (error) console.log("Error in connection due to : ", error);
        else console.log("Connected to MongoDB Cluster !\n");
    }
);

// Logs every request to the console
app.use(morgan("dev"));

//Body Parser Middlleware
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Passing express app variable to routes
require("./routes")(app);

// Server
app.listen(port, () => {
    console.log("User details server started on : " + port);
});
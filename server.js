// load .env data into process.env

require("dotenv").config();

// Web server config

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");


// PG database client/connection setup

const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);

db.connect();
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

/****************** SASS CONFIGURATION *****************/

app.use(
  "/scss-styles",
  sass({
    src: __dirname + "/scss-styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
app.use(express.static("public"));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

/****************** PINEAPPLE ROUTES *****************/

const eventsRoutes = require("./routes/events");
const eventsNewRoutes = require("./routes/eventsNew");
const eventsAdminRoutes = require("./routes/eventsAdmin");
const eventsPublicRoutes = require("./routes/eventsPublic");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));

// Note: mount other resources here, using the same pattern above

app.use("/events", eventsRoutes(db));
app.use("/events/new", eventsNewRoutes.navigateToPage(db));
app.use("/events/:admin_slug", eventsAdminRoutes(db));
app.use("/events/:public_slug", eventsPublicRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("home");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


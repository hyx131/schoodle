const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    res.render("../views/events_admin");
  });

  router.post("/");

  return router;
};

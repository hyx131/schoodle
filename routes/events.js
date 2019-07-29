const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("../views/events_final");
  });

  router.post("/", (req, res) => {
    res.redirect("/events/new");
  })

  return router;
};



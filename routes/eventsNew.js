const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("../views/events_new");
  });

  router.post("/", (req, res) => {
    res.render("../views/events-final");
  })

  return router;
};

const express = require("express");
const router = express.Router();
const pool = require("../db/dbPool");



module.exports = db => {
  router.get("/:admin_token", (req, res) => {

    return pool.query(`SELECT * FROM users`)
    .then(results => {
      console.log('RESULTS: ', results.rows[0])
      res.render("../views/events_admin", results);
    })
  });

  router.post("/");

  return router;
};

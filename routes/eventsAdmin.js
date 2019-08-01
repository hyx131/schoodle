const express = require("express");
const router = express.Router();
const pool = require("../db/dbPool");

module.exports = db => {
  router.get("/:admin_token", (req, res) => {
    let adminToken = req.params.admin_token;
    console.log(adminToken);

    pool
      .query(
        `SELECT users.*, events.*, time_slots.* FROM users JOIN events ON users.id = user_id JOIN time_slots ON event_id = events.id WHERE admin_token = '${adminToken}'`
      )
      .then(results => {
        console.log("RESULTS: ", results.rows[0]);
        res.render("../views/events_admin", results.rows[0]);
      })
      .catch(e => console.log("error in events/:admin_token", e));
  });

  return router;
};

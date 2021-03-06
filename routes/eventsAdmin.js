const express = require("express");
const router = express.Router();
const pool = require("../db/dbPool");
const {  generateRandomString, toggleButton } = require("./helpers.js");





module.exports = db => {
  router.get("/:admin_token/json", (req, res) => {
    let adminToken = req.params.admin_token;

    pool.query(`SELECT * FROM rsvps JOIN users ON users.id = user_id JOIN events ON events.id = event_id WHERE admin_token = '${adminToken}'`)
    .then(results => {
      // console.log("=====AVAILABILITY=====", results);
      let rsvp = results.rows;

      res.json({ rsvp });
    })
    .catch((e) => console.log('error in events/:admin_token/json', e))
  });


  router.get("/:admin_token/time", (req, res) => {
    let adminToken = req.params.admin_token;

  pool.query(`SELECT users.*, events.*, time_slots.* FROM users JOIN events ON users.id = user_id JOIN time_slots ON event_id = events.id WHERE admin_token = '${adminToken}'`)
    .then(results => {
      let data = results.rows;

      res.json({ data });
    })
    .catch((e) => console.log('error in events/:admin_token/time', e))
  });

  router.get("/:admin_token/table", (req, res) => {
    let data = req.body;

    res.json({ data })
  });


  router.get("/:admin_token", (req, res) => {
    let adminToken = req.params.admin_token;
    console.log(adminToken);

  pool.query(`SELECT users.*, events.*, time_slots.* FROM users JOIN events ON users.id = user_id JOIN time_slots ON event_id = events.id WHERE admin_token = '${adminToken}'`)
    .then(results => {
      console.log('RESULTS: ', results.rows)
      let data = results.rows;
      res.render("../views/events_admin", { data: data });
    })
    .catch((e) => console.log('error in events/:admin_token', e))
  });



  router.post('/:admin_token', (req, res) => {
    let aToken = req.params.admin_token;
    let gEmail = req.body.email;

    console.log("TTTTTTT", aToken);
    console.log("EEEEEEEEEE", gEmail);

    pool.query(`
    (SELECT id FROM events WHERE admin_token = '${aToken}') UNION ALL
    (SELECT id FROM users WHERE email = '${gEmail}');
    `).then((res) => {
      console.log("rrrrrrrr", res);
      let eventId = res.rows[0].id;
      let guestId = res.rows[1].id;
      console.log('===eventId====', res.rows)
      console.log('====eventID====', eventId)
      console.log('====guestID====', guestId)

      const TEXT = "INSERT INTO rsvps (availability, user_id, event_id) VALUES ($1, $2, $3) RETURNING *";
      pool.query(TEXT, [false, guestId, eventId]).then((res) => {
        console.log("=====rsvp=====", res);
      }).catch(e => console.log("insert rsvp err", e));
    })

    res.status(204).send();
  })




  return router;

};





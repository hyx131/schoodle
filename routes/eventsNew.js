const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

/*******************************MAILGUN BELOW******************************/

//HELPER FUNCTION , MOVE TO ANOTHER FILE

const generateRandomString = function() {
  let result = "";
  let randomText =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomTextLength = randomText.length;
  for (let i = 0; i < 12; i++) {
    result += randomText.charAt(Math.floor(Math.random() * randomTextLength));
  }
  return result;
};

const adminRandomKey = generateRandomString();
const guestsRandomKey = generateRandomString();

/*******************************MAILGUN ABOVE******************************/

const pool = new Pool({
  user: "labber",
  host: "localhost",
  database: "midterm",
  password: "labber",
  port: 5432
});

const addUser = function(database) {
  console.log("WORKING");
  console.log(database);

  const text = "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *";
  return pool
    .query(text, [database.users.userName, database.users.userEmail])

    .then(userResults => {
      console.log(userResults.rows[0]);

      return pool.query(
        `
        INSERT INTO events (title, address, description, admin_token, guest_token, user_id )
        VALUES ($1, $2, $3, $4, $5,$6 ) RETURNING *;
        `,
        [
          database.events.userEvent,
          database.events.address,
          database.events.eventDescription,
          adminRandomKey,
          guestsRandomKey,
          userResults.rows[0].id
        ]
      )
    .then(eventsResults => {
      console.log(eventsResults.rows[0]);
      return pool.query(
        `
        INSERT INTO time_slots (start_date_time, end_date_time, event_id)
        VALUES ($1, $2, $3) RETURNING *;
      `,
        [
          database.time_slots.startTime,
          database.time_slots.endTime,
          eventsResults.rows[0].id
        ]
      )
    .then(timeSlotsResults => {
      console.log(timeSlotsResults.rows[0]);

      return { user: userResults.rows[0], event: eventsResults.rows[0], timeSlots: timeSlotsResults.rows[0] }
    })
      .catch(err => {
      console.log(err);
      })
    })
  })
};

module.exports = {
  addUser: addUser,
  navigateToPage: function navigateToPage(db) {
    router.get("/", (req, res) => {
      res.render("../views/events_new");
    });
    return router;
  }
};

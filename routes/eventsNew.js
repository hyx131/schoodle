const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const { generateRandomString } = require('./helpers.js')

/*******************************MAILGUN BELOW******************************/

//HELPER FUNCTION , MOVE TO ANOTHER FILE

// const generateRandomString = function() {
//   let result = "";
//   let randomText =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
//   let randomTextLength = randomText.length;
//   for (let i = 0; i < 12; i++) {
//     result += randomText.charAt(Math.floor(Math.random() * randomTextLength));
//   }
//   return result;
// };

// const adminRandomKey = generateRandomString();
// const guestsRandomKey = generateRandomString();

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
      console.log("uuuuuuuuuuuser results:", userResults.rows[0]);

      return pool.query(
        `
        INSERT INTO events (title, address, description, admin_token, guest_token, user_id )
        VALUES ($1, $2, $3, $4, $5,$6 ) RETURNING *;
        `,
        [
          database.events.userEvent,
          database.events.address,
          database.events.eventDescription,
          generateRandomString(),
          generateRandomString(),
          userResults.rows[0].id
        ]
      )
    .then(eventsResults => {
      console.log("eeeeeeevents results:", eventsResults.rows[0]);

      // getting individual time values from the array of start & end times:

      let startTime;
      let endTime;
      let allPromiseQueries = [];

      for (let i = 0; i < database.time_slots.startTime.length; i++) {
        startTime = database.time_slots.startTime[i];
        for (let k = 0; k < database.time_slots.endTime.length; k++) {
          endTime = database.time_slots.endTime[k];

          allPromiseQueries.push(pool.query(
            `
            INSERT INTO time_slots (start_date_time, end_date_time, event_id)
            VALUES ($1, $2, $3) RETURNING *;
          `,
            [
              startTime,
              endTime,
              eventsResults.rows[0].id
            ]
          ).then(timeSlotsResults => {
            console.log("zzzzzzzzzzzzzzzzz", timeSlotsResults.rows[0]);
            // return timeSlotsResults.rows[0];
            console.log("z2z2z2z2z2z2z2z2z:", userResults.rows[0]);
            console.log("eeeee333333eeeeee", eventsResults.rows[0]);
          }));
          break;
        }
      }

      Promise.all(allPromiseQueries)
      .then((lotsResults) => {
        return lotsResults;
      })

    })
    .then(lotsResults => {
      console.log("shoulde be same as zzzzzzzzzz", lotsResults);

      return { user: userResults.rows[0], event: eventsResults.rows[0], timeSlots: timeSlotsResults.rows[0] }

    })
    .catch(err => {
      console.log(err);
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

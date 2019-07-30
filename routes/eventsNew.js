const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

/*******************************MAILGUN BELOW******************************/

// const mailgun = require("mailgun-js");
// const mg = mailgun({ apiKey: api_key, domain: DOMAIN });

// const data = {
//   to: "acmhuang@gmail.com",
//   from: "pineapple@no-reply.com",
//   subject: "Pineapple Event",
//   text: "Hello!"
// };

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
  pool
    .query(text, [database.users.userName, database.users.userEmail])

    .then(results => {
      console.log(results.rows[0]);

      return pool.query(
        `
        INSERT INTO events (name, address, description, admin_token, guest_token, user_id )
        VALUES ($1, $2, $3, $4, $5,$6 ) RETURNING *;
        `,
        [
          database.events.userEvent,
          database.events.address,
          database.events.eventDescription,
          adminRandomKey,
          guestsRandomKey,
          results.rows[0].id
        ]
      );
    })
    .then(results => {
      console.log(results.rows[0]);

      // getting individual time values from the array of start & end times:

        let startTime;
        let endTime;

        for (let i = 0; i < database.time_slots.startTime.length; i++) {
          startTime = database.time_slots.startTime[i];
          for (let k = 0; k < database.time_slots.endTime.length; k++) {
            endTime = database.time_slots.endTime[k];

            pool.query(
              `
              INSERT INTO time_slots (start_date_time, end_date_time, event_id)
              VALUES ($1, $2, $3) RETURNING *;
            `,
              [
                startTime,
                endTime,
                results.rows[0].id
              ]
            ).then(results => {
              console.log(results.rows[0]);
            });

          }
        }
    })
    .then(results => {
      console.log(results.rows[0]);
    })
    .catch(err => {
      console.log(err);
    });
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

// function navigateToPage(db) {
//   router.get("/", (req, res) => {
//     res.render("../views/events_new");
//   });
// }

//THIS IS THE ORIGINAL FILES module.exports code block, and the router post for mailgun works//
// module.exports = db => {
//   router.get("/", (req, res) => {
//     res.render("../views/events_new");
//   });
// };
//   router.post("/", (req, res) => {
//     mg.messages().send(data, function(error, body) {
//       console.log(body);
//     });
//     res.redirect("/events");
//   });

//   return router;
// };

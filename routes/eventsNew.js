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
  pool.query(text, [database.users.userName, database.users.userEmail])

  .then(results => {
    console.log(results.rows[0]);

      return pool.query(
        `
        INSERT INTO events (name, address, description, admin_token, guest_token, user_id )
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `,
        [
          database.events.userEvent,
          database.events.address,
          database.events.eventDescription,
          "token",
          "guest_token",
          1
        ]
      );
    })

    .then(results => {

      console.log(results.rows[0]);
      return pool.query(`
        INSERT INTO time_slots (event_date, start_time, end_time, event_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `, [
        database.time_slots.eventDate ,
        database.time_slots.startTime,
        database.time_slots.endTime,
        1
      ]);
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

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


// function to add to users table:
const addUser = function(database) {
  console.log("WORKING");
  console.log(database);

  const text = "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *";
  return pool.query(text, [database.users.userName, database.users.userEmail])

    .then(userResults => {
      console.log("uuuuuuuuuuuser results:", userResults.rows[0]);
      return userResults;
    })
    .catch(err => {
      console.log(err);
    })
};




// function to add to events table:
const addEvent = function(database, uId){
  return pool.query(`
    INSERT INTO events (title, address, description, admin_token, guest_token, user_id)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `,
  [
    database.events.userEvent,
    database.events.address,
    database.events.eventDescription,
    generateRandomString(),
    generateRandomString(),
    uId
  ])
  .then(eventResults => {
    console.log("eeeeeeevents results:", eventResults.rows[0]);
    return eventResults;
  })
  .catch((e) => console.log('dint work', e))
};



// function to add multiple event-related time slots:
const addTimeSlots = function(database, eId) {

  let startTime;
  let endTime;
  let arrTime = [];

  for (let i = 0; i < database.time_slots.startTime.length; i++) {
    startTime = database.time_slots.startTime[i];
    endTime = database.time_slots.endTime[i];

    arrTime.push(addTime(startTime, endTime, eId));
  }

  return Promise.all(arrTime).then((result) => {
    // console.log("---------allTimeSlot Results:", result);
    return result;
  })
};



// function to add single time slot:
const addTime = function(startTime, endTime, eId) {
  return pool.query(
    `
    INSERT INTO time_slots (start_date_time, end_date_time, event_id)
    VALUES ($1, $2, $3) RETURNING *;
  `,
    [
      startTime,
      endTime,
      eId
    ]
  ).then(timeSlotsResults => {
    // console.log("zzzzzzzzzzzzzzzzz", timeSlotsResults.rows[0]);
    return timeSlotsResults.rows[0];
  });
}




module.exports = {
  addUser: addUser,
  addEvent: addEvent,
  addTimeSlots: addTimeSlots,
  getUserId: getUserId,
  getEventId: getEventId,
  navigateToPage: function navigateToPage(db) {
    router.get("/", (req, res) => {
      res.render("../views/events_new");
    });
    return router;
  }
};

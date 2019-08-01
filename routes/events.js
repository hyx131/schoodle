const express = require("express");
const router = express.Router();
const { addUser, addEvent, addTimeSlots } = require("./eventsNew");
const pool = require("../db/dbPool");

/*********************************************************************************/

module.exports = db => {

  router.post("/", (req, res) => {
    const mailgun = require("mailgun-js");
    const mg = mailgun({
      apiKey: process.env.MAIL_GUN_PRIVATE_KEY,
      domain: process.env.MAIL_GUN_DOMAIN
    });

    const dataOne = {
      to: req.body.invitesEmail,
      from: req.body.userEmail,
      subject: "Pineapple Event",
      text: "Hello!"
    };
    mg.messages().send(dataOne, function(error, body) {
      console.log("completed invite emails sent!");
    });

    const allData = { users: {}, events: {}, time_slots: {} };

    // users:
    allData.users.userName = req.body.userName ? req.body.userName : null;
    allData.users.userEmail = req.body.userEmail ? req.body.userEmail : null;

    // events:
    allData.events.userEvent = req.body.userEvent ? req.body.userEvent : null;
    allData.events.eventDescription = req.body.eventDescription ? req.body.eventDescription : null;
    allData.events.address = req.body.eventLocation ? req.body.eventLocation : null;

    // timestamps from calendar input:
    allData.time_slots.startTime = []; // array of startTime values
    allData.time_slots.endTime = [];

    for (let i of req.body.times) {
      allData.time_slots.startTime.push(i.startTime ? i.startTime : null);
      allData.time_slots.endTime.push(i.endTime ? i.endTime : null);
    }


    // insert guest email into database;
    for (let i of req.body.guestMail) {
      const TEXT = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *"

      pool.query(TEXT, [null, i]).then((guestMailResults) => {
        console.log("----MAIL----", guestMailResults);
      }).catch((e) => console.log('add guest email err',e))

      console.log("--------------", i);
    }

    addUser(allData)
    .then(userData => {

      let userId = userData.rows[0].id;
      // console.log('-------------UserId', userId);

      addEvent(allData, userId)
      .then(eventData => {
        let eventId = eventData.rows[0].id;

        // console.log("event data:", eventData);

        addTimeSlots(allData, eventId).then(() => {
          res.redirect(`/events/${eventData.rows[0].admin_token}`);
        }).catch((e) => console.log('add time slots err',e))
      }).catch((e) => console.log('add event err', e))
    }).catch((e) => console.log('add user err', e))

  });

  return router;
};

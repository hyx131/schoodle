const express = require("express");
const router = express.Router();
const addUser = require("./eventsNew");
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

    // users
    allData.users.userName = req.body.userName ? req.body.userName : null;
    allData.users.userEmail = req.body.userEmail ? req.body.userEmail : null;
    allData.events.userEvent = req.body.userEvent ? req.body.userEvent : null;
    allData.events.eventDescription = req.body.eventDescription ? req.body.eventDescription : null;
    allData.events.address = req.body.eventLocation ? req.body.eventLocation : null;
    // calendar
    allData.time_slots.eventDate = req.body.eventDate ? req.body.eventDate : null;
    allData.time_slots.startTime = req.body.startTime ? req.body.startTime : null;
    allData.time_slots.endTime = req.body.endTime ? req.body.endTime : null;

      addUser.addUser(allData)
      .then(data => {
        let templateVars = data;
        console.log('Newly Created Event ', templateVars)
      console.log(data)
      console.log(data.event.admin_token)
      res.redirect(`/events/${data.event.admin_token}`)
    });
  });

  return router;
};

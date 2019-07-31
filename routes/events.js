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


    addUser.addUser(allData)
    .then(data => {
      let templateVars = data;
      console.log('Newly Created Event ', templateVars)
      res.redirect(`/events/${data.event.admin_token}`)
    });

  });

  return router;
};

const express = require('express');
const router  = express.Router();
const addUser = require("./eventsNew");

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("../views/events_final");
  });

  router.post("/", (req, res) => {
    const allData = { users: {}, events: {} };
    allData.users.userName = req.body.userName ? req.body.userName : null;
    allData.users.userEmail = req.body.userEmail ? req.body.userEmail : null;
    allData.events.userEvent = req.body.userEvent ? req.body.userEvent : null;
    allData.events.eventDescription = req.body.eventDescription ? req.body.eventDescription : null;
    allData.events.address = req.body.eventLocation ? req.body.eventLocation : null;

    // calendar
    allData.events.eventDates = req.body.eventDates ? req.body.eventDates : null;
    addUser.addUser(allData);

    res.redirect("/events/new");
  })

  return router;
};



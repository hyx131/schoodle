const express = require("express");
const router = express.Router();
const addUser = require("./eventsNew");

module.exports = db => {
  router.get("/", (req, res) => {
    res.render("../views/events_final");
  });

  router.post("/", (req, res) => {
    const allData = { users: {}, events: {}, time_slots: {} };

    // users
    allData.users.userName = req.body.userName ? req.body.userName : null;
    allData.users.userEmail = req.body.userEmail ? req.body.userEmail : null;

    // events
    allData.events.userEvent = req.body.userEvent ? req.body.userEvent : null;
    allData.events.eventDescription = req.body.eventDescription
      ? req.body.eventDescription
      : null;
    allData.events.address = req.body.eventLocation
      ? req.body.eventLocation
      : null;

    // calendar
    allData.time_slots.eventDate = req.body.eventDate
      ? req.body.eventDate
      : null;
    allData.time_slots.startTime = req.body.startTime
      ? req.body.startTime
      : null;
    allData.time_slots.endTime = req.body.endTime ? req.body.endTime : null;

    addUser.addUser(allData);

    res.render("events_final", allData);
  });

  return router;
};

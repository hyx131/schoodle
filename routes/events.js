const express = require("express");
const router = express.Router();
const addUser = require("./eventsNew");

module.exports = db => {
  router.get("/", (req, res) => {
    res.render("../views/events_final");
  });

  router.post("/", (req, res) => {

    console.log(req.body.times);
    const allData = { users: {}, events: {}, time_slots: {} };

    // users:
    allData.users.userName = req.body.userName ? req.body.userName : null;
    allData.users.userEmail = req.body.userEmail ? req.body.userEmail : null;

    // events:
    allData.events.userEvent = req.body.userEvent ? req.body.userEvent : null;
    allData.events.eventDescription = req.body.eventDescription
      ? req.body.eventDescription
      : null;
    allData.events.address = req.body.eventLocation
      ? req.body.eventLocation
      : null;

    // timestamps from calendar input:
    allData.time_slots.startTime = []; // array of startTime values
    allData.time_slots.endTime = [];

    for (let i of req.body.times) {
      allData.time_slots.startTime.push(i.startTime ? i.startTime : null);
      allData.time_slots.endTime.push(i.endTime ? i.endTime : null);
    }


    addUser.addUser(allData);
    res.render("events_final", allData);
  });

  return router;
};

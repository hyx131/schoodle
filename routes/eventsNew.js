const express = require("express");
const router = express.Router();

/*******************************MAILGUN BELOW******************************/

const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });

const data = {
  to: "selin.hyx@gmail.com",
  from: "pineapple@no-reply.com",
  subject: "Pineapple Event",
  text: "Hello!"
};

/*******************************MAILGUN ABOVE******************************/

module.exports = db => {
  router.get("/", (req, res) => {
    res.render("../views/events_new");
  });

  router.post("/", (req, res) => {
    mg.messages().send(data, function(error, body) {
      console.log(body);
    });
    res.redirect("/events");
  });

  return router;
};

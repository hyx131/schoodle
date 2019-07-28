const express = require("express");
const router = express.Router();

/*******************************MAILGUN BELOW******************************/

const mailgun = require("mailgun-js");
const api_key = "29d32e359e7c667bc5221a4dd4fc1e3c-c50f4a19-3f18e980";
const DOMAIN = "sandbox60a2c85051984f98a8bd718646dbeaed.mailgun.org";
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

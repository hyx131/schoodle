const express = require('express');
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: 'labber',
  host: 'localhost',
  database: 'midterm',
  password: 'labber',
  port: 5432,
})

const addUser = function (database) {

  console.log('WORKING')
  console.log(database)

  const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'

  console.log(database.users.userName, database.users.userEmail)

  pool.query(text, [database.users.userName, database.users.userEmail])
    .then((results => {

      console.log(results.rows[0])

      return pool.query(`
  INSERT INTO events (name, address, description )
  VALUES ($1, $2, $3) RETURNING *;
  `, [database.events.userEvent, database.events.address, database.events.eventDescription])
    })).then((results => {

      console.log(results.rows[0])

    })).then((results => {

      console.log(results.rows[0])

    }))
    .catch((err) => {

      console.log(err)

    });
}

module.exports = {

  addUser: addUser,
  navigateToPage: function navigateToPage(db) {
    router.get("/", (req, res) => {
      res.render("../views/events_new");
    });

    return router;
  }
}


// function navigateToPage(db) {
//   router.get("/", (req, res) => {
//     res.render("../views/events_new");
//   });


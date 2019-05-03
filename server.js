const express = require('express');
const connection = require('./db/connection');
const path = require('path');

// create server using express() and set a port
const app = express();
const PORT = process.env.PORT || 3000;

// set up our middleware to handle incoming POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// set up our routes
app.get("/", function(req, res) {
  connection.query("SELECT * FROM plans;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { plans: data });
  });
});


// GET all tables
app.get('/api/tables', function(req, res) {
  // query db for all table data
  connection.query('SELECT * FROM tables', function(err, tableData) {
    if (err) {
      return res.status(500).json(err);
    }
    // if no error, send back array of table data
    res.json(tableData);
  });
});

// POST route that takes in req.body and creates a new reservation
app.post('/api/tables', function(req, res) {
  // retrieve count of how many people are NOT on waiting list
  connection.query('SELECT COUNT(*) AS waitingCount FROM tables WHERE isWaiting = false', function(
    err,
    waitingListData
  ) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    // check if number of people NOT on waiting list is 5 or greater
    if (waitingListData[0].waitingCount >= 5) {
      req.body.isWaiting = true;
    }

    // insert new table reservation using req.body as data
    connection.query('INSERT INTO tables SET ?', req.body, function(err, insertResult) {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      }
      // if insert was successful
      res.json({ status: 'successful' });
    });
  });
});

app.get('*', function(req, res) {
  res.send('<h1>💁‍♀️ 404 Error!</h1>');
});

// turn on server, make sure this is last in the file
app.listen(PORT, () => console.log(`🗺️ You are now on localhost:${PORT}.`));

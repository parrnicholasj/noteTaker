const express = require('express');
var exphbs = require("express-handlebars");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = require('./connection');
const path = require('path');

// create server using express() and set a port
const PORT = process.env.PORT || 3000;

// set up our middleware to handle incoming POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// set up our routes
app.get("/", function (req, res)
{
  connection.query("SELECT * FROM notes;", function (err, data)
  {
    if (err)
    {
      return res.status(500).end();
    }
    
    res.render("home", { notes: data });
  });
});

app.post("/api/notes", function (req, res)
{
 console.log(req.body.noteTitle);
 var sql = "INSERT INTO notes (title, content) VALUES (?)";
 var values = [req.body.noteTitle, req.body.note];
  connection.query(sql, [values], function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }

   
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
    
  });

})


// app.delete("/api/notes/:id", function(req, res) {
//   connection.query("DELETE FROM plans WHERE id = ?", [req.params.id], function(err, result) {
//     if (err) {
//       console.log(err0l);
//       return res.status(500).end();
//     }
//     else if (result.affectedRows === 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     }
//     res.status(200).end();

//   });
// });


app.get('*', function (req, res)
{
  res.send('<h1>💁‍♀️ 404 Error!</h1>');
});

// turn on server, make sure this is last in the file
app.listen(PORT, () => console.log(`🗺️ You are now on localhost:${PORT}.`));

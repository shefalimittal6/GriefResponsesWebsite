const mysql = require('mysql2');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const ejs = require('ejs');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "db" // Add your database name here
});

//Connect to MySQL database
con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Send HTML form to the user
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submission
app.post('/', (req, res) => {
  const data = req.body.response;
  console.log(data);

  const currentDate = new Date();
  const date = currentDate.toISOString().slice(0, 10); // Format date as YYYY-MM-DD

  // Insert data into the database
  // Table name is customers and the fields are date and confession
  const sql = "INSERT INTO customers (ID, CONFESSION) VALUES (?, ?)";
  con.query(sql, [date, data], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Value inserted');
  });

  // Retrieve data from the database and render the profile page
  const selectSql = "SELECT * FROM customers";
  con.query(selectSql, (err, data) => {
    if (err) {
      console.error('Error retrieving data from database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(data);
    res.render('profile', { data });
  });
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});

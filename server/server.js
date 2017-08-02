require('dotenv').config();  // Enable access to .env variables

// Set up Express, middleware 
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require("http");
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
app.use(bodyParser.json());   // Parse text as JSON, expose result object on req.body
app.use(express.static(path.join(__dirname, '../public/')));   // Serve up static files 


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


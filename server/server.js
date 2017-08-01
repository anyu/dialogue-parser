require('dotenv').config();  // Enable access to .env variables

// Set up Express, middleware 
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require("http");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());   // Parse text as JSON, expose result object on req.body
app.use(express.static(path.join(__dirname, '../public/')));   // Serve up static files 


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


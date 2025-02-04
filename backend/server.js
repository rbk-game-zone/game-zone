const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT ;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./model/index');

app.use(express.json())
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./model/index');
const userRoute = require('./router/user.router');
const gameRoute = require('./router/game.router');
const path = require('path');

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.use('/api/user', userRoute)
app.use('/api', gameRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
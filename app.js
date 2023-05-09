const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6459a0f84395273c07a996ce'
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена'}));

app.listen(PORT);
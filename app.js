const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { login, createUser, exit } = require('./controllers/users');
const { errorHandler } = require('./middlewares/errorHandler')
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors')

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({
  origin: [
  "http://logos.nomoredomains.rocks",
  "https://logos.nomoredomains.rocks",
  "http://api.logos.nomoredomains.rocks",
  "https://api.logos.nomoredomains.rocks",
  "http://localhost:3000"
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
  method: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-_~:?#[\]@!$&'()*+,;=]{1,}\.[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+,;=]{1,}/i),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), createUser);

app.use(auth);

app.get('/exit', exit);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена'}));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler)

app.listen(PORT);
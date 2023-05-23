const bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      user = require('../models/user');

const BadRequest = require('../errors/BadRequest'),
      NotFoundError = require('../errors/NotFoundError'),
      Unauthorized = require('../errors/Unauthorized'),
      Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const {

  errorCodeMessage400,
  errorCodeMessage401,
  errorCodeUserMessage404,
  errorCodeMessage409
  
} = require('../utils/constants.js');

module.exports.getUsers = (req, res, next) => {
	
  user.find({})
    .then(user => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {

  user.findById(req.user._id)
    .then(user => res.send(user))
    .catch(BadRequest(errorCodeMessage400));
};

module.exports.getUserId = (req, res, next) => {

  user.findById(req.params.userId)
    .then((user) => {
      user
      ? res.send(user)
      : next(new NotFoundError(errorCodeUserMessage404))
    .catch((err) => {
    
    err.name === 'CastError'
    ? next(new BadRequest(errorCodeMessage400))
    : next(err)
    });
  });
};

module.exports.createUser = (req, res, next) => {

  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => user.create({name, about, avatar, email, password: hash}))
    .then(user => res.status(200).send(user))
    .catch((err) => {

      err.name === 'ValidationError'
      ? next(new BadRequest(errorCodeMessage400))
      : err.code === 11000
        ? next(new Conflict(errorCodeMessage409))
        : next(err)
    });
};

module.exports.updateUserInfo = (req, res, next) => {

  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true })
  .then(user => res.send(user))
  .catch((err) => {
    
    err.name === 'ValidationError'
    ? next(new BadRequest(errorCodeMessage400))
    : err.name === 'CastError'
      ? next(new NotFoundError(errorCodeUserMessage404))
      : next(err)
  });
};

module.exports.updateUserAvatar = (req, res, next) => {

  const { avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true })
  .then(user => res.send(user))
  .catch((err) => {
    
    err.name === 'ValidationError'
    ? next(new BadRequest(errorCodeMessage400))
    : err.name === 'CastError'
      ? next(new NotFoundError(errorCodeUserMessage404))
      : next(err)
  });
};

module.exports.login = (req, res, next) => {

  const { email, password } = req.body;

  user.findUserByCredentials(email, password)
    .then(user => {

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'});

      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "none"
      });
    })
    .catch((err) => {
      next(new Unauthorized(errorCodeMessage401))
    });
};
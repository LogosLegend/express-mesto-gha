const user = require('../models/user.js');

const {

  errorCode400,
  errorCode404,
  errorCode500,
  errorCodeMessage400,
  errorCodeUserMessage404,
  errorCodeMessage500
  
} = require('../utils/constants.js');

module.exports.getUsers = (req, res) => {
	
  user.find({})
    .then(user => res.send(user))
    .catch((err) => {
      res.status(errorCode500).send(errorCodeMessage500)
    });
};

module.exports.getUser = (req, res) => {

  user.findById(req.params.userId)
    .then((user) => {
      user
      ? res.send(user)
      : res.status(errorCode404).send(errorCodeUserMessage404)})
    .catch((err) => {
    
    err.name === 'CastError'
    ? res.status(errorCode400).send(errorCodeMessage400)
    : res.status(errorCode500).send(errorCodeMessage500)
  });
};

module.exports.createUser = (req, res) => {

  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      
      err.name === 'ValidationError'
      ? res.status(errorCode400).send(errorCodeMessage400)
      : res.status(errorCode500).send(errorCodeMessage500)
    });
};

module.exports.updateUserInfo = (req, res) => {

  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true })
  .then(user => res.send(user))
  .catch((err) => {
    
    err.name === 'ValidationError'
    ? res.status(errorCode400).send(errorCodeMessage400)
    : err.name === 'CastError'
      ? res.status(errorCode404).send(errorCodeUserMessage404)
      : res.status(errorCode500).send(errorCodeMessage500)
  });
};

module.exports.updateUserAvatar = (req, res) => {

  const { avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true })
  .then(user => res.send(user))
  .catch((err) => {
    
    err.name === 'ValidationError'
    ? res.status(errorCode400).send(errorCodeMessage400)
    : err.name === 'CastError'
      ? res.status(errorCode404).send(errorCodeUserMessage404)
      : res.status(errorCode500).send(errorCodeMessage500)
  });
};
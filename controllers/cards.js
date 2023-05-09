const card = require('../models/card.js');

const {

  errorCode400,
  errorCode404,
  errorCode500,
  errorCodeMessage400,
  errorCodeCardMessage404,
  errorCodeMessage500
  
} = require('../utils/constants.js');

module.exports.getCards = (req, res) => {

  card.find({})
    .then(card => res.send(card))
    .catch((err) => {
      res.status(errorCode500).send(errorCodeMessage500)
    });
};

module.exports.createCard = (req, res) => {

  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then(card => res.send(card))
    .catch((err) => {
      
      err.name === 'ValidationError'
      ? res.status(errorCode400).send(errorCodeMessage400)
      : res.status(errorCode500).send(errorCodeMessage500)
    });
};

module.exports.deleteCard = (req, res) => {

  card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      card
      ? res.send(card)
      : res.status(errorCode404).send(errorCodeCardMessage404)})
    .catch((err) => {
      
      err.name === 'CastError'
      ? res.status(errorCode400).send(errorCodeMessage400)
      : res.status(errorCode500).send(errorCodeMessage500)
    });
};

module.exports.likeCard = (req, res) => {

  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
  .then((card) => {
    card
    ? res.send(card)
    : res.status(errorCode404).send(errorCodeCardMessage404)})
  .catch((err) => {
    
    err.name === 'CastError'
    ? res.status(errorCode400).send(errorCodeMessage400)
    : res.status(errorCode500).send(errorCodeMessage500)
  });
};

module.exports.deleteLikeCard = (req, res) => {

  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
  .then((card) => {
    card
    ? res.send(card)
    : res.status(errorCode404).send(errorCodeCardMessage404)})
  .catch((err) => {
    
    err.name === 'CastError'
    ? res.status(errorCode400).send(errorCodeMessage400)
    : res.status(errorCode500).send(errorCodeMessage500)
  });
};
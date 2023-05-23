const Card = require('../models/card.js');

const BadRequest = require('../errors/BadRequest'),
      Forbidden = require('../errors/Forbidden'),
      NotFoundError = require('../errors/NotFoundError')

const {

  errorCodeMessage400,
  errorCodeMessage403,
  errorCodeCardMessage404
  
} = require('../utils/constants.js');

module.exports.getCards = (req, res, next) => {

  Card.find({})
    .then(card => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {

  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send(card))
    .catch((err) => {
      
      err.name === 'ValidationError'
      ? next(new BadRequest(errorCodeMessage400))
      : next()
    });
};

module.exports.deleteCard = (req, res, next) => {

  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      console.log(req.user._id)
      console.log(card)
      card
      ? req.user._id == card.owner._id
        ? Card.findByIdAndRemove(cardId)
            .then(() => res.send({ message: "Удаление выполнено" }))
            .catch(next)
        : next(new Forbidden(errorCodeMessage403))
      : next(new NotFoundError(errorCodeCardMessage404))
    .catch((err) => {
      
      err.name === 'CastError'
      ? next(new BadRequest(errorCodeMessage400))
      : next()
    });
  });
}

module.exports.likeCard = (req, res, next) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      card
      ? res.send(card)
      : next(new NotFoundError(errorCodeCardMessage404))
    .catch((err) => {
      
      err.name === 'CastError'
      ? next(new BadRequest(errorCodeMessage400))
      : next()
    });
  });
}

module.exports.deleteLikeCard = (req, res, next) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      card
      ? res.send(card)
      : next(new NotFoundError(errorCodeCardMessage404))
    .catch((err) => {
      
      err.name === 'CastError'
      ? next(new BadRequest(errorCodeMessage400))
      : next()
  });
  });
}
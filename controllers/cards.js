const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');

const {

  errorCodeMessage400,
  errorCodeMessage403,
  errorCodeCardMessage404,

} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorCodeMessage400));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (card) {
        if (req.user._id === card.owner._id.toString()) {
          Card.findByIdAndRemove(cardId)
            .then(() => res.send({ message: 'Удаление выполнено' }))
            .catch(next);
        } else {
          next(new Forbidden(errorCodeMessage403));
        }
      } else {
        next(new NotFoundError(errorCodeCardMessage404));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(errorCodeMessage400));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError(errorCodeCardMessage404));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(errorCodeMessage400));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError(errorCodeCardMessage404));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(errorCodeMessage400));
      } else {
        next(err);
      }
    });
};

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard, likeCard, deleteLikeCard } = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24)
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24)
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24)
  }),
}), deleteLikeCard);

module.exports = router;
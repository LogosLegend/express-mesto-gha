const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, getUser, getUserId, createUser, updateUserInfo, updateUserAvatar } = require('../controllers/users.js');

router.get('/users', getUsers);

router.get('/users/me', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex()
  }),
}), getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex()
  }),
}), getUserId);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-_~:\/?#\[\]@!$&'()*+,;=]{1,}\.[a-zA-Z0-9.\-_~:\/?#\[\]@!$&'()*+,;=]{1,}/i),
  }),
}), updateUserAvatar);

module.exports = router;
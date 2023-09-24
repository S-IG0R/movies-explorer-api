const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, updateUserInfo } = require('../controllers/users');

// возвращает данные текущего юзера
router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getUser,
);

// обновляет данные текущего юзера
router.patch(
  '/users/me',
  celebrate({
    body: {
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
    },
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  updateUserInfo,
);

module.exports = router;

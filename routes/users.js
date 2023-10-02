const router = require('express').Router();

const {
  headersValidation,
  userUpdateValidation,
} = require('../validation/validator');

const { getUser, updateUserInfo } = require('../controllers/users');

// возвращает данные текущего юзера
router.get('/users/me', headersValidation, getUser);

// обновляет данные текущего юзера
router.patch('/users/me', userUpdateValidation, updateUserInfo);

module.exports = router;

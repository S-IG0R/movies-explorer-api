const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

// логин
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// регистрация
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser,
);

// авторизация, расположенные ниже пути защищены ею
router.use(auth);

router.use(userRouter);
router.use(moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Данного пути не существует'));
});

module.exports = router;

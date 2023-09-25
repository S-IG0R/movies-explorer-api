const router = require('express').Router();

const {
  loginValidation,
  registrationValidation,
} = require('../validation/validator');

const { createUser, login } = require('../controllers/users');

const userRouter = require('./users');
const moviesRouter = require('./movies');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

// логин
router.post('/signin', loginValidation, login);

// регистрация
router.post('/signup', registrationValidation, createUser);

// авторизация, расположенные ниже пути защищены ею
router.use(auth);

router.use(userRouter);
router.use(moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Данного пути не существует'));
});

module.exports = router;

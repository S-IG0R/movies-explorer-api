const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = require('http2').constants;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mongoose } = require('mongoose');
require('dotenv').config();

const User = require('../models/user');

const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 12;

// создает нового пользователя
const createUser = (req, res, next) => {
  const { name, password, email } = req.body;
  bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({ name, email, password: hash })
      .then((newUser) => {
        return res.status(HTTP_STATUS_CREATED).send({
          name: newUser.name,
          email: newUser.email,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(
            new ConflictError(
              'Пользователь с такими данными уже зарегистрирован',
            ),
          );
        }
        if (err instanceof mongoose.Error.ValidationError) {
          return next(new BadRequestError('Переданы некорректные данные'));
        }
        return next(err);
      });
  });
};

// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password') // добавляет пароль в запрос
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверно указан email и/или password');
      }
      // сравниваем пароль введенный пользователем с хешем в БД
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверно указан email и/или password');
        }
        // если пароль совпал с хешем создаем токен
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret_key',
          { expiresIn: '7d' },
        );
        // отправляем токен в куки со сроком годность в 7 дней
        return res
          .status(HTTP_STATUS_OK)
          .send({ token });
      });
    })
    .catch(next);
};

// возвращает данные о залогиненном пользователе
const getUser = (req, res, next) => {
  // если авторизованы, вытаскиваем id юзера из запроса
  const { _id } = req.user;
  User.findOne({ _id })
    .then((currentUser) => {
      res.status(HTTP_STATUS_OK).send(currentUser);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((updatedUser) => {
      res.status(HTTP_STATUS_OK).send(updatedUser);
    })
    .catch((err) => {
      if (
        err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError
      ) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  updateUserInfo,
  createUser,
  login,
};

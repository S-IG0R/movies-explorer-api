const { celebrate, Joi } = require('celebrate');
const urlChecker = require('../utils/constants');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const registrationValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const headersValidation = celebrate({
  headers: Joi.object()
    .keys({ authorization: Joi.string().required() })
    .unknown(),
});

const userUpdateValidation = celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  },
  headers: Joi.object()
    .keys({ authorization: Joi.string().required() })
    .unknown(),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlChecker).required(),
    trailerLink: Joi.string().regex(urlChecker).required(),
    thumbnail: Joi.string().regex(urlChecker).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
  headers: Joi.object()
    .keys({ authorization: Joi.string().required() })
    .unknown(),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
  headers: Joi.object()
    .keys({ authorization: Joi.string().required() })
    .unknown(),
});

module.exports = {
  loginValidation,
  registrationValidation,
  headersValidation,
  userUpdateValidation,
  createMovieValidation,
  deleteMovieValidation,
};

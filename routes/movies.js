const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlChecker = require('../utils/constants');

const {
  getAllUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все фильмы добавленные пользователем
router.get(
  '/movies',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getAllUserMovies,
);

// создает фильм
router.post(
  '/movies',
  celebrate({
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
  }),
  createMovie,
);

// удаляет фильм по ID
router.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  deleteMovie,
);

module.exports = router;

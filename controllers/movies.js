const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = require('http2').constants;

const { mongoose } = require('mongoose');
const Movies = require('../models/movie');

// классы ошибок для центр. обработчика
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// возвращает все сохранённые текущим пользователем фильмы
const getAllUserMovies = (req, res, next) => {
  return Movies.find({ owner: req.user._id })
    .then((userMovies) => {
      return res.status(HTTP_STATUS_OK).send(userMovies);
    })
    .catch(next);
};

// создаёт фильм
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  return Movies.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((newMovie) => {
      return res.status(HTTP_STATUS_CREATED).send(newMovie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  return Movies.findById({ _id: req.params._id })
    .orFail(new NotFoundError('Запрашиваемый фильм не найден'))
    .then((movie) => {
      if (movie.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Удаление чужого фильма запрещено');
      }
      return Movies.deleteOne(movie)
        .orFail(new NotFoundError('Запрашиваемый фильм не найден'))
        .then(() => {
          return res
            .status(HTTP_STATUS_OK)
            .send({ message: 'Фильм успешно удалён' });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getAllUserMovies,
  createMovie,
  deleteMovie,
};

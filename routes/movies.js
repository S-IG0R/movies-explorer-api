const router = require('express').Router();

const {
  headersValidation,
  createMovieValidation,
  deleteMovieValidation,
} = require('../validation/validator');

const {
  getAllUserMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все фильмы добавленные пользователем
router.get('/movies', headersValidation, getAllUserMovies);

// создает фильм
router.post('/movies', createMovieValidation, createMovie);

// удаляет фильм по ID
router.delete('/movies/:_id', deleteMovieValidation, deleteMovie);

module.exports = router;

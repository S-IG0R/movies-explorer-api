const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');
require('dotenv').config();

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

// парсер тела запросов
app.use(express.json());

// роутер
app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// центр. обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const limit = require('./middlewares/rateLimit');
const router = require('./routes/index');
const cors = require('./middlewares/cors');
require('dotenv').config();

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

const app = express();

// обработчик CORS запросов
app.use(cors);

// подключает к ДБ
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB, URL: ${DB_URL}`);
  });

// защита заголовков
app.use(helmet());

// парсер тела запросов
app.use(express.json());

// логгер запросов
app.use(requestLogger);

// ограничитель запросов к серверу
app.use(limit);

// роутер
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// центр. обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});

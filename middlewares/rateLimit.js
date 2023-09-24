const rateLimit = require('express-rate-limit');

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // с одного ip за 15 мин
  max: 1000, // разрешено 100 запросов
});

module.exports = limit;

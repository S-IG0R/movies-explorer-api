const rateLimit = require('express-rate-limit');

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // с одного ip за 15 мин
  max: 1200, // разрешено 1200 запросов
});

module.exports = limit;

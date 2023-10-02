const allowedCorsUrl = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://cinematic.nomoredomainsrocks.ru',
  'https://cinematic.nomoredomainsrocks.ru',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  /*   ОБРАБОТКА ПРОСТЫХ ЗАПРОСОВ   */
  // достаем из заголовка origin и сравниваем его с разрешенными
  const { origin } = req.headers;

  if (allowedCorsUrl.includes(origin)) {
    // если найден среди разрешенных, отвечаем следующим заголовком,
    // который разрешает запросы браузеру
    res.header('Access-Control-Allow-Origin', origin);
  }
  // если не найден, пропускаем дальше, браузер сам его заблокирует

  /*   ОБРАБОТКА СЛОЖНЫХ ЗАПРОСОВ   */
  // Сохраняем тип запроса (HTTP-метод)
  const { method } = req;
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
};

module.exports = cors;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', ''); // Убираем приставку Bearer
  let payload;
  try {
    // если удалось верифицировать ключ, записывается _id в пейлоуд
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret_key',
    );
  } catch (err) {
    if (err.message === 'invalid signature') {
      throw new UnauthorizedError('Неверная формат токена');
    }
    if (err.message === 'jwt expired') {
      throw new UnauthorizedError('Токен просрочен');
    }
    if (err.message === 'invalid token') {
      throw new UnauthorizedError('Неверный токен');
    }
    throw new UnauthorizedError('Необходима авторизация');
  }
  // добавляем _id ко всем запросам
  req.user = payload;
  next();
};

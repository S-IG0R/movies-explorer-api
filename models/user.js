const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: (email) => {
          return validator.isEmail(email);
        },
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      require: true,
      select: false, // запрещает возврат пароля в ответе, работает только с find методами
    },
    name: {
      type: String,
      require: true,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
  },
  { versionKey: false }, // убирает версию
);

module.exports = mongoose.model('user', userSchema);

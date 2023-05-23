const errorCodeMessage400 = { message: 'Переданы некорректные данные' },
      errorCodeMessage401 = { message: 'Неверный email или пароль' },
      errorCodeUserMessage404 = { message: 'Пользователь не найден' },
      errorCodeCardMessage404 = { message: 'Карточка не найдена' },
      errorCodeMessage409 = { message: 'Пользователь уже зарегистрирован' };


module.exports = { errorCodeMessage400, errorCodeMessage401, errorCodeUserMessage404, errorCodeCardMessage404, errorCodeMessage409 };
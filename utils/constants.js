const errorCode400 = 400,
      errorCode404 = 404,
      errorCode500 = 500,
      errorCodeMessage400 = { message: 'Переданы некорректные данные' },
      errorCodeUserMessage404 = { message: 'Пользователь не найден' },
      errorCodeCardMessage404 = { message: 'Карточка не найдена' },
      errorCodeMessage500 = { message: 'Произошла ошибка' };


module.exports = { errorCode400, errorCode404, errorCode500, errorCodeMessage400, errorCodeUserMessage404, errorCodeCardMessage404, errorCodeMessage500 };
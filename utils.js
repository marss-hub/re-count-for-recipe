/**
 * Функция обрабатывает входные данные  и возвращает число со знаками после запятой не более трех
 * @param {(number|string)} value число в типе string или number
 * @returns
 */
 export function formatter(value) {
    return Number(Number(value).toFixed(3));
  }
  
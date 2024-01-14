/**
 * Модуль Рецепт
 * @module Recipe
 */

import { Ingredient } from "./Ingredient.js";
import { formatter } from "./utils.js";


/**
 * Класс отвечает за работу с рецептом (набором объектов класса Ingredient)
 */
export class Recipe {
  /**
   * Map состоящий из набора объектов-ингредиентов
   * @type {Map<string, Ingredient>}
   * @private
   */
  #ingredientsSource = new Map();
  /**
   * Map состоящий из набора объектов-ингредиентов
   * @type {Map<string, Ingredient>}
   * @public
   */
  ingredients = new Map();

  /**
   * Для формирования рецепта необходимо передать массив с объектами класса Ingredient
   * @param {{Ingredient[]}} objArr Массив с объектами класса Ingredient
   */
  constructor(objArr) {
    for (const item of objArr) {
      if (item instanceof Ingredient === false) {
        throw new TypeError(`ОШИБКА! ${item} Не принадлежит классу Ingredient`);
      }
      this.ingredients.set(item.cid, item);
      this.#ingredientsSource.set(item.cid, item.clone());
    }
  }

  /**
   * Возвращает Mаp с исходными данными из #ingredientsSource
   * @returns Map с исходными данными
   */
  getIngrSrc() {
    return this.#ingredientsSource;
  }

  /**
   * пересчитывает данные на основе переданной дельты и первоначальных данных, записывает новые данные в ingredients
   * @param {number} delta дельта для изменения
   */
  recount(delta) {
    for (const item of this.ingredients) {
      item[1].value = this.#ingredientsSource.get(item[0]).value * delta;
    }
  }

  /**
   * переписывает данные в ingredients на данные из #ingredientsSource (сбрасывает значения к первоначальным)
   */
  reset() {
    for (const item of this.ingredients) {
      item[1].value = this.#ingredientsSource.get(item[0]).value;
    }
  }

  /**
   * возвращает данные, хранящиеся в ingredients в виде стрингифицированного объекта
   * @returns стрингифицированный объект
   */
  toJSON() {
    const resultObj = {};
    for (const item of this.ingredients) {
      resultObj[item[0]] = item[1];
    }
    return JSON.stringify(resultObj);
  }

/**
 * Возвращает набор строк, в которых перечисляются ингридиенты в читаемом формате
 * @returns {string[]}
 */
  getCurrentComponentsStrArr() {
    const resArr = [];
    resArr.push(`РЕЦЕПТ:\n \n`)
    for (const item of this.ingredients) {
      resArr.push(`${item[1].name}: ${formatter(item[1].value)} ${item[1].measure} \n`)
    }
    return resArr
  }
}

/**
 * Модуль Ингредиент
 * @module Ingredient
 */

/**
 * Класс отвечает за работу с ингредиентом
 */
export class Ingredient {
  /**
   * Название ингредиента
   * @type {string}
   * @public
   */
  name = "";
  /**
   * Объем ингредиента
   * @type {number}
   * @public
   */
  value = 0;
  /**
   * Ед.измерения ингредиента
   * @type {string}
   * @public
   */
  measure = "";
    /**
   * Внутренний текстовый id ингредиента
   * @type {string}
   * @public
   */
    cid = "";
  /**
   * Для создания экземпляра класса необходимо передать в конструктор объект с соответствующей структурой
   * @param {{name: string, value: number, measure: string, cid: string}} objData объект
   */
  constructor(objData) {
    ({ name: this.name, value: this.value, measure: this.measure, cid: this.cid} = objData);
  }

  /**
   * Метод клонирует объект
   * @returns {Ingredient} клон объекта
   */
  clone() {
    return new Ingredient({
      name: this.name,
      value: this.value,
      measure: this.measure,
    });
  }
}

/**
 * Модуль Форма ввода
 * @module FormBuilder
 */

import { ERRORS } from "./initData.js";

/**
 * Класс отвечает за создание и работу формы с полями ввода
 */
export class FormBuilder {
  /**
   * DOM-node контейера формы с полями ввода
   * @type {HTMLElement}
   * @private
   */
  #divRoot = null;

  /**
   * DOM-node с формой полей ввода
   * @type {HTMLElement}
   * @private
   */
  #userInputsBox = null;

  /**
   * DOM-node с шаблоном
   * @type {HTMLElement}
   * @private
   */
  #templates = null;

  /**
   * DOM-node (input) кнопки "Добавить ингредиент"
   * @type {HTMLElement}
   * @private
   */
  #newItemButton = null;


  /**
   * Для работы необходимо передать DOM-node контейера в виде объекта определенной структуры
   * @param {{divRoot: {HTMLElement}}} divRoot обект с DOM-node контейера с формами ввода
   */
  constructor({ divRoot }) {
    if (!(divRoot instanceof Node))
      throw new Error("Некорректный dom-элемент контейера формы");

    const userInputsBox = divRoot.querySelector(".user-inputs");
    const templates = divRoot.querySelector(".templates");
    const newItemButton = divRoot.querySelector('input[name="insert-new"]');
    
    if (!userInputsBox || !templates || !newItemButton)
      throw new Error("Некорректный dom-элемент ");

    newItemButton.onclick = () => this.makeNewFieldSet();

    this.#divRoot = divRoot;
    this.#userInputsBox = userInputsBox;
    this.#templates = templates;
    this.#newItemButton = newItemButton;
  }


  /**
   * добавляет новую строку форм ввода
   */
  makeNewFieldSet() {
    const newItem = this.#templates.querySelector("#tmpl-ingredient").content.cloneNode(true);
    const deleteItemButton = newItem.querySelector(".btn-close");
    deleteItemButton.onclick = (e) => {
      [...this.#userInputsBox.querySelectorAll(".ingredient-fields-row")].find((item) => item.contains(e.target)).remove();
    }
    this.#userInputsBox.append(newItem);
  }

  /**
   * проверяет корректность введенных значений в строках полей ввода
   * @returns {(string|null)}  код ошибки либо null
   */
  checkForm() {
    const currentFieldsetArr = this.#userInputsBox.querySelectorAll(".ingredient-fields-row");
    let error = null;
    for (let item of currentFieldsetArr) {
      const userInputValue = item.querySelector('input[name="value"]');
      //проверяем что данные - число (возможно дробное) и что оно больше 0.001
      if (
        !/^\d+([,.]\d+)?$/.test(userInputValue.value) ||
        Number(userInputValue.value) < 0.001
      ) {
        userInputValue.classList.add("error-in-Field");
        setTimeout(
          () => userInputValue.classList.remove("error-in-Field"),
          3000
        );
        error = ERRORS.INVALID_INPUT;
      }
    }
    return error;
  }

  /**
   * собирает данные из fieldsetов формы полей ввода и возвращает в виде массива объектов
   * @returns {{name: string, value: number, measure: string, cid: string}[]} массв объектов определенной структуры
   */
  dataCollector() {
    const itemsSetArr = Array.from(this.#userInputsBox.querySelectorAll(".ingredient-fields-row"));

    const resultArr = itemsSetArr.map((item) => {
      const userInputName = item.querySelector('input[name="name"]');
      const userInputValue = item.querySelector('input[name="value"]');
      const userInputMeasure = item.querySelector('input[name="measure"]');
      return {
        name: `${userInputName.value}`,
        value: userInputValue.value,
        measure: `(${userInputMeasure.value})`, 
        cid: `cid_${itemsSetArr.indexOf(item)}`,
      };
    });
    for (let item of resultArr) {
      if (item.value === "") item.value = "0";
      if (item.name === "") item.name = "Нет названия";
      if (item.measure === "()") item.measure = "";
    }

    return resultArr;
  }

  /**
   * Метод вызывает показ формы
   */
  show() {
    this.#divRoot.classList.remove("form-disabled");
  }

  /**
   * Метод скрывает форму полей ввода
   */
  hide() {
    this.#divRoot.classList.add("form-disabled");
  }

  /**
   * Метод проверки формы полей ввода на скрытость
   * @returns {boolean}
   */
  isHidden() {
    return this.#divRoot.classList.contains("form-disabled");
  }
}

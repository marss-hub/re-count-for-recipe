/**
 * Модуль Main
 * @module Main
 */

import { FormBuilder } from "./FormBuilder.js";
import { FormRecalc } from "./FormRecalc.js";
import { Ingredient } from "./Ingredient.js";
import { Recipe } from "./Recipe.js";

/**
 * Основной класс реализующий функционал и взаимодействие между модулями программы
 */

export class Main {
  //ДАННЫЕ:
  /**
   * DOM-node содержащая список возможных ошибок
   * @type {HTMLElement}
   * @private
   */
  #errViewElem = null;

  /**
   * DOM-node корневого dom-элемента приложения
   * @type {HTMLElement}
   * @private
   */
  #root = null;

  /**
   * объект класса FormBuilder
   * @type {FormBuilder}
   * @private
   */
  #formBuilder = null;

  /**
   * объект класса FormRecalc
   * @type {FormRecalc}
   * @private
   */
  #formRecalc = null;

  /**
   * объект класса Recipe либо null (при ошибке в создании/обновлении Recipe)
   * @type {?Recipe}
   * @private
   */
  #recipe = null; //null | Recipe

  /**
   * DOM-node кнопки "пересчитать значения"
   * @type {HTMLElement}
   * @private
   */
  #initButton = null;

  /**
   * DOM-node кнопки "изменить значения"
   * @type {HTMLElement}
   * @private
   */
  #reInitButton = null;

  /**
   * Для работы необходимо передать ряд элементов:
   * @param {HTMLElement} errViewElem DOM-node содержащая список возможных ошибок
   * @param {HTMLElement} root DOM-node корневого dom-элемента приложения
   * @param {FormBuilder} formBuilder объект класса FormBuilder
   * @param {FormRecalc} formRecalc объект класса FormRecalc
   */

  constructor({ errViewElem, root, formBuilder, formRecalc }) {
    //ПРОВЕРКИ:
    if (!(errViewElem instanceof Node))
      throw new Error("Не указан корректный DOM-элемент для размещения");
    if (!(root instanceof Node))
      throw new Error("Не указан корректный корневой DOM-элемент");
    if (!(formBuilder instanceof FormBuilder))
      throw new Error("Не корректный объект класса");
    if (!(formRecalc instanceof FormRecalc))
      throw new Error("Не корректный объект класса");

    //кнопка "пересчитать значения"
    const initButton = root.querySelector('input[name="init-button"]');
    if (!initButton) throw new Error("Не корректный шаблон");
    initButton.onclick = () => {
      const errId = formBuilder.checkForm(); //вернется код ошибки либо null
      if (errId) {
        this.showErr(errId); //вывод сообщения об ошибке
      } else {
        root.querySelector("#calc-recipe").hidden = false; //подключение формы калькулятора
        const data = formBuilder
          .dataCollector()
          .map((item) => new Ingredient(item)); //dataCollector соберет данные из полей заново
        this.#recipe = new Recipe(data); // обновление Recipe

        //обновление данных для скачивания по ссылке
        const downloadFileLink = root.querySelector('#download-file-link');
        const recipeData = new Blob(this.#recipe.getCurrentComponentsStrArr() );
        downloadFileLink.href = URL.createObjectURL(recipeData);
        
        this.showFormRecalc();
        //прокрутка страницы к началу программы(пересчетчику)
        const recalcFormDiv = document.querySelector('.form-recalc');
        const topPos = recalcFormDiv.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: topPos, // scroll so that the element is at the top of the view
          behavior: 'smooth' // smooth scroll
        })
      }
    };

    //кнопка "изменить значния"
    const reInitButton = root.querySelector('input[name="reinit-button"]');
    if (!reInitButton) throw new Error("Не корректный шаблон");

    reInitButton.onclick = () => {
      this.showFormBuilder();
    };

    //НАЗНАЧЕНИЯ:
    this.#errViewElem = errViewElem;
    this.#root = root;
    this.#formBuilder = formBuilder;
    this.#formRecalc = formRecalc;
    this.#initButton = initButton;
    this.#reInitButton = reInitButton;
  }

  /**
   * инициирует показ ошибки, затем скрывает её
   * @param {string} errId код ошибки
   */
  showErr(errId) {
    const elem = this.#errViewElem.querySelector(`.${errId}`);
    elem.hidden = false;
    setTimeout(() => (elem.hidden = true), 3000);
  }

  /**
   * Показывает форму калькулятора, запускает ее работу с данными из полей ввода. (данные берутся заново)
   * (подробнее: метод используется в onclick кнопки "пересчитать значения" и каждый раз
   * данные берутся из передаваемого {Recipe}, а обновление {Recipe} стоит перед вызовом данного метода)
   */
  showFormRecalc() {
    if (this.#recipe instanceof Recipe) {
      this.#formRecalc.recounter(this.#recipe);
    } else {
      console.warn("Отсутствует рецепт");
    }

    this.#initButton.disabled = true;
    this.#reInitButton.disabled = false;

    this.#formRecalc.show();
    this.#formBuilder.hide();
  }

  /**
   * Скрывает форму калькулятора и показывает поля ввода данных
   */
  showFormBuilder() {
    this.#initButton.disabled = false;
    this.#reInitButton.disabled = true;

    this.#formRecalc.hide();
    this.#formBuilder.show();
  }
}

/**
 * Модуль Форма калькулятора(пересчетчика)
 * @module FormRecalc
 */
import { Recipe } from "./Recipe.js";
import { formatter } from "./utils.js";

/**
 * Класс отвечает за создание и работу формы-калькулятора
 */
export class FormRecalc {
  /**
   * DOM-node контейера формы калькулятора
   * @type {HTMLElement}
   * @private
   */
  #divRoot = null;

  /**
   * DOM-node с формой калькулятора
   * @type {HTMLElement}
   * @private
   */
  #recounterFieldsBox = null;

    /**
   * DOM-node с шаблоном
   * @type {HTMLElement}
   * @private
   */
    #templates = null;

  /**
   * Для работы необходимо передать DOM-node контейера в виде объекта определенной структуры
   * @param {{divRoot: {HTMLElement}}} divRoot оъекс с DOM-node контейера формы калькулятора
   */
  constructor({ divRoot }) {
    //деструктуризация
    if (!(divRoot instanceof Node))
      throw new Error("Некорректный dom-элемент контейера формы");

    const recounterFieldsBox = divRoot.querySelector(".recounter");
    const templates = divRoot.querySelector(".templates");

    if (!recounterFieldsBox || !templates) throw new Error("Некорректный dom-элемент для recounter");

    this.#divRoot = divRoot;
    this.#recounterFieldsBox = recounterFieldsBox;
    this.#templates = templates;
  }

  /**
   * метод управляет добавлением и изменением данных в полях калькулятора (но непосредственно он не пересчитывает)
   * @param {Recipe} recipe объект класса Recipe
   */
  recounter(recipe) {
    if (!(recipe instanceof Recipe))
      throw new Error("Объект не принадлежит классу Recipe");

    this.#recounterFieldsBox.innerHTML = ""; 

    //передаем данные в поля DOM модели
    for (const item of recipe.ingredients) {
      const newField = this.#templates.querySelector("#tmpl-field-recalc").content.cloneNode(true);
      const label = newField.querySelector("label");
      label.innerHTML = `${item[1].measure} ${item[1].name}`
      label.htmlFor = item[1].cid;
      
      const input = newField.querySelector("input");
      input.name = item[1].cid;
      input.value = formatter(item[1].value);
      this.#recounterFieldsBox.append(newField)
    }

    //событийная часть формы
    this.#recounterFieldsBox.onchange = (e) => {
      const ratio =
        (e.target.value * 1) / recipe.getIngrSrc().get(e.target.name).value; //считаем дельту
      recipe.recount(ratio); //изменяем значения по дельте
      this.#update(recipe);
      this.#updateDataLink(recipe);
    };

    //кнопка сброса
    const ejectButton = this.#divRoot.querySelector(
      'input[name="ejector"]'
    );
    ejectButton.onclick = () => {
      recipe.reset();
      this.#update(recipe);
      this.#updateDataLink(recipe);
    };
  }

  /**
   * обновляет значение value в полях формы в HTML, новые значения берутся из переданного {Recipe}
   * @param {Recipe} recipe объект класса Recipe
   */
  #update(recipe) {
    for (const item of recipe.ingredients) {
      const itemChange = this.#recounterFieldsBox.querySelector(`input[name="${item[1].cid}"]`);
      itemChange.value = formatter(item[1].value);
    }
  }

  /**
   * обновляет данные для скачивания по ссылке
   * @param {Recipe} recipe объект класса Recipe
   */
  #updateDataLink(recipe) {
  const downloadFileLink = this.#divRoot.querySelector('#download-file-link');
  const recipeData = new Blob(recipe.getCurrentComponentsStrArr() );
  downloadFileLink.href = URL.createObjectURL(recipeData);
  }

  /**
   * Метод вызывает показ формы
   */
  show() {
    this.#divRoot.hidden = false;
  }

  /**
   * Метод скрывает форму
   */
  hide() {
    this.#divRoot.hidden = true;
  }

  /**
   * Метод проверки формы на скрытость
   * @returns {boolean}
   */
  isHidden() {
    return this.#divRoot.hidden;
  }
}

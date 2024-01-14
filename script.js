import { Main } from "./Main.js";
import { FormBuilder } from "./FormBuilder.js";
import { FormRecalc } from "./FormRecalc.js";

const root = document.querySelector(".app .main");
const errViewElem = document.querySelector(`.err-msgs`);

const formBuilder = new FormBuilder({
  divRoot: root.querySelector(".form-builder"),
});
formBuilder.makeNewFieldSet();

const formRecalc = new FormRecalc({
  divRoot: root.querySelector(".form-recalc"),
});

const main = new Main({ errViewElem, root, formBuilder, formRecalc });

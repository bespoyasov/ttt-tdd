import DomController from "./DomController.js";
import Game from "./Game.js";

const game = new Game();
const dom = new DomController({
  root: "body",
  game,
});

dom.init();

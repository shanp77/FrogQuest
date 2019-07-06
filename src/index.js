import Game from "./Game";
import GameView from "./GameView";


document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y; 
  const ctx = canvasEl.getContext("2d");
 
  const game = new Game(ctx);
  new GameView(game, ctx).titleScreen();
});


// import _ from 'lodash';

// function component() {
//   const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// }

// document.body.appendChild(component());
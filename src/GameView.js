
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.game.gameView = this;
    this.frog = this.game.addFrog();
  }

  bindKeyHandlers() {
    const frog = this.frog;

    Object.keys(GameView.MOVES).forEach((k) => {
     let direction = GameView.MOVES[k];
      key(k, () => { frog.moveFrog(direction); });
    });

  }

  start() {
    
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.game.addCars();
    this.game.addFloatingObjects();
    this.game.loadSounds();
    // start the animation
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }


  animate(time) {
    const timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }

}


GameView.MOVES = {
  "left": "LEFT",
  "right": "RIGHT",
  "up": "UP",
  "down": "DOWN",
};

export default GameView;

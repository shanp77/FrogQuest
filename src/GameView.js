
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.game.gameView = this;
    this.frog = this.game.addFrog();
    this.counter = 0;
    this.animCounter = 0;
    this.animationId = null;
    this.blurred = false;
    this.startTime = 0;
    this.animate = this.animate.bind(this);
    this.isReFocused = false;

    //window.addEventListener("focus", () => this.onFocus());
    //window.addEventListener("blur", () => this.onBlur());
  }

  onFocus() {
    this.isReFocused = true;
    console.log("refocused");
  }

  onBlur() {
    alert("blurred");
    cancelAnimationFrame(this.gameView.animationId);
  }

  bindKeyHandlers() {
    const frog = this.frog;

    Object.keys(GameView.MOVES).forEach((k) => {
     let direction = GameView.MOVES[k];
      key(k, () => { frog.moveFrog(direction); });
    });
    
  }

  titleScreen() {
    this.game.titleScreen(this.ctx);
    key("enter", () => { this.start(); });
    this.game.loadSounds();
  }

  start() {
    setTimeout(() => this.game.sounds.beginGameMusic.play(), 150);
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.game.addCars();
    this.game.addFloatingObjects();
    
    // start the animation
    this.animationId = requestAnimationFrame(time => {
      this.startTime = time;
      this.animate(time);
    });
  }


  animate(time) {
   //console.log(++this.animCounter);
    const timeDelta = time - this.startTime;
    if(timeDelta < 100) {
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
    }
    this.startTime = time;
    this.counter += 0.02;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate);
  }

}


GameView.MOVES = {
  "left": "LEFT",
  "right": "RIGHT",
  "up": "UP",
  "down": "DOWN",
};

export default GameView;

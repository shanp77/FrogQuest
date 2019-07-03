import Frog from "./Frog";
import Car from "./Car";
import FloatingObject from "./FloatingObject";
import StaticObject from "./StaticObject";
import SkullSymbol from "./SkullSymbol";



// const Truck = require("./Truck");
// const Turtle = require("./Turtle");
// const Log = require("./Log");
import Util from "./util";


class Game {
  constructor() {
    this.sounds = {};

    this.cars = [];
    this.floatingObjects = [];
    this.staticObjects = [];
    this.frogs = [];
    this.frogLives = 3;
    this.furthestYPos = Game.DIM_Y; 
    this.width = Game.DIM_X;
    this.height = Game.DIM_Y;
    this.midPointY = Game.MID_POINT_Y;
    this.endPointY = Game.END_POINT_Y;
    this.grid = Game.GRID;
    this.homeBaseGoals = this.calculateHomeBaseGoals();
    this.goalsScored = [];
    this.messages = null;
    this.score = 0;
    //this.addAsteroids();
    //window.addEventListener("focus", () => this.onFocus());
    window.addEventListener("blur", () => this.onBlur());
  }

  freezeAnimation() {
    cancelAnimationFrame(this.gameView.animationId);
  }

  onBlur() {
    console.log("blurred");
    cancelAnimationFrame(this.gameView.animationId);
  }

  onFocus() {
    console.log("focused");
    this.resetObjects();
  }
  resetObjects(){
    this.cars = [];
    this.floatingObjects = [];
    this.addCars();
    this.addFloatingObjects();
  
  }

  add(object) {
    if (object instanceof Frog) {
      this.frogs.push(object);
    } else if (object instanceof Car) {
      this.cars.push(object);
    
    } else if (object instanceof FloatingObject) {
      this.floatingObjects.push(object);
    } else if (object instanceof StaticObject) {
      this.staticObjects.push(object);
    } 
    
  }

  calculateHomeBaseGoals() {
    let goalWidth = 50;
    let offsetX = 15;
    let homeBaseGoals = [];

    for (let i = 0; i < 5; i++) {
      
      let left = offsetX;
      let right = offsetX + goalWidth;
      homeBaseGoals.push({ left, right });
      offsetX += 110;
    }
    return homeBaseGoals;
  }

  calculatePoints(eventType) {
    switch(eventType) {
      case Game.MOVE_UP:
        if(this.frogs[0].y < this.furthestYPos) {
          this.score += 10;
          this.furthestYPos = this.frogs[0].y;
          console.log(this.score);
        }
        break;
      case Game.SCORE_GOAL:
        this.score += 50;
        break;
      case Game.LEVEL_COMPLETE:
        this.score += 1000;
        break;
    }
  }

  titleScreen(ctx) {
    // paint top half blue
    ctx.fillStyle = "#09528f";
    ctx.fillRect(0,0, Game.DIM_X, (Game.DIM_Y / 2));

    // paint bottom half black
    ctx.fillStyle = "black";
    ctx.fillRect(0, Game.DIM_Y / 2, Game.DIM_X, Game.DIM_Y);

    // write "FROG QUEST" in green on screen
    ctx.fillStyle = "#3bd627";
    ctx.font = 52 + "pt Arial ";
    ctx.textAlign = "center";
    ctx.fillText("FROGGERY", Game.DIM_X / 2, Game.GRID * 3);

    //menu options
    ctx.fillStyle = "white";
    ctx.font = 17 + "pt Arial ";
    ctx.fillText("PRESS ENTER TO PLAY", Game.DIM_X / 2, Game.GRID * 6);

    // credits
    ctx.font = 12 + "pt Arial ";
    ctx.textAlign = "left";
    ctx.fillText("May 2019", Game.GRID * 1, Game.DIM_Y - Game.GRID / 2);

    ctx.textAlign = "right";
    ctx.fillText("Created by Shannon Piesinger", Game.DIM_X - Game.GRID, Game.DIM_Y - Game.GRID / 2);
  }

  drawBackground(ctx) {
    
    
    // draw water
    let waterImg = new Image();
    waterImg.src = "./images/water.png";
    for(let i = 0; i < 5; i++) {
      for(let j = 0; j < 13; j++) {
        let offsetX = j * (Game.GRID);
        let offsetY = 78 + (i * Game.GRID);
        ctx.drawImage(waterImg, offsetX, offsetY);
      }
    }

    //draw goals from image
    let goalsImg = new Image();
    let bushesImg = new Image();
    goalsImg.src = "./images/river_bank_goal.png";
    bushesImg.src = "./images/river_bank_bushes.png";

    let offsetX = 0;
    for(let i = 0; i < 4; i++) {
     
      ctx.drawImage(goalsImg, offsetX, 0);
      offsetX += 78;
      ctx.drawImage(bushesImg, offsetX, 0);
      offsetX += 32;
      if (i === 3) {
        ctx.drawImage(goalsImg, offsetX, 0);
      }
    }
    // draw goals at top of screen
    // let frog = this.frogs[0];
    // let lineStart = 0;
    // ctx.strokeStyle = "#555";
    // ctx.lineWidth = 4;
    // ctx.beginPath();
    // for (let i = 0; i < this.homeBaseGoals.length; i++) {
    //   let base = this.homeBaseGoals[i];


    //   ctx.moveTo(lineStart, 50);
    //   ctx.lineTo(base.left, 50);
    //   ctx.closePath();
    //   ctx.stroke();
    //   lineStart = base.right;

    //   // draw last segment of wall on right side of last goal
    //   if (i === this.homeBaseGoals.length - 1) {
    //     ctx.beginPath();
    //     ctx.moveTo(lineStart, 50);
    //     ctx.lineTo(this.width, 50);
    //     ctx.closePath();
    //     ctx.stroke();
    //   }

    // }
    // color middle space between road and river purple
    ctx.fillStyle = "purple";
    ctx.fillRect(0, Game.MID_POINT_Y - Game.GRID, this.width, Game.GRID);
    ctx.fill();

    //color starting row purple
    ctx.fillStyle = "purple";
    ctx.fillRect(0, this.height - Game.GRID, this.width, Game.GRID);
    ctx.fill();

    // draw a frog icon for each goal if scored
    let img = new Image();
    img.src = "./images/frog.png";

    
    this.goalsScored.forEach( goal => {
      ctx.drawImage(img, goal.left + 5, 30);
    });
  }

  objDistance(right, dist) {
    return right + dist;
  }

  startYCar(row) {
    let gridTop = Game.DIM_Y - (Game.GRID * row);
    let startY = gridTop - (Game.GRID - ((Game.GRID - Car.HEIGHT) / 2));
    return startY;
  }

  addCars(pos) {
    // this.addCarRow(vel, dist, posi, type, numCars, width);

    // row 1
    this.addCarRow([-1,0], 100, [100, this.startYCar(1)], "yellow-racer", 3, Game.YELLOW_RACER_WIDTH);
    // row 2
    this.addCarRow([1,0], 120, [100, this.startYCar(2)], "blue-racer", 3, Game.TRACTOR_WIDTH);
    // // row 3
    this.addCarRow([-2,0], 120, [100, this.startYCar(3)], "green-racer", 3, Game.SEDAN_WIDTH);
    // // row 4
    this.addCarRow([1,0], 120, [560, this.startYCar(4)], "fire-truck", 3, Game.WHITE_RACER_WIDTH);
    // // row 5
    this.addCarRow([-2,0], 130, [80, this.startYCar(5)], "truck", 2, Game.TRUCK_WIDTH);

    
  }

  addCarRow(vel, dist, posi, type, numCars, width = null) {

    for (let i = 0; i < numCars; i++) {
      // calculate distance from the right edge of the last car
      if((i !== 0)) {
        let lastCar = this.cars[this.cars.length - 1];
        let offsetX = (lastCar.x + lastCar.width) + dist;
        let newXPos = offsetX % Game.DIM_X;
        posi[0] = newXPos;
      }
      this.add(new Car({ game: this, pos: [posi[0], posi[1]], vel, type, width }));
    }
  }

  startYObj(row) {
    let gridTop = Game.MID_POINT_Y - (Game.GRID * row);
    let startY = gridTop - (Game.GRID - ((Game.GRID - FloatingObject.HEIGHT) / 2));
    return startY;
  }

  addFloatingObjects(pos) {
    // addFloatingObjectRow(vel, dist, posi, type, numObjects, width)

    // row 1
    this.addFloatingObjectRow([-2,0], 80, [100, this.startYObj(1)], "turtles-3", 4, Game.THREE_TURTLE_PACK_WIDTH);
    // row 2
    this.addFloatingObjectRow([1,0], 120, [100, this.startYObj(2)], "short-log", 3, Game.SMALL_LOG_WIDTH);
    // // row 3
    this.addFloatingObjectRow([2,0], 100, [100, this.startYObj(3)], "long-log", 3, Game.LONG_LOG_WIDTH);
    // // row 4
    this.addFloatingObjectRow([-1,0], 100, [560, this.startYObj(4)], "turtles-2", 4, Game.TWO_TURTLE_PACK_WIDTH);
    // // row 5
    this.addFloatingObjectRow([1,0], 120, [80, this.startYObj(5)], "medium-log", 3, Game.MEDIUM_LOG_WIDTH);


  }

  addFloatingObjectRow(vel, dist, posi, type, numObjects, width = null) {
    if(type === "turtles-3") {
      console.log(`posi: ${posi}, width: ${width}`);
    }
    // start first object in row off-screen to the left
    let rowWidth = (width * numObjects) + (dist * numObjects);
    let firstOffsetX = (Game.HIDDEN_DIM_X - rowWidth) / 2;
    posi[0] = Game.HIDDEN_START_X + firstOffsetX;
    for (let i = 0; i < numObjects; i++) {
      // calculate distance from the right edge of the last car
      if ((i !== 0)) {
        let lastObj = this.floatingObjects[this.floatingObjects.length - 1];
        let offsetX = (lastObj.x + lastObj.width) + dist;
        let newXPos = offsetX % Game.DIM_X;
        posi[0] = newXPos;
      }

      this.add(new FloatingObject({ game: this, pos: [posi[0], posi[1]], vel, type, width }));
    }
  }

  addFrog() {
    let startX = Game.GRID * 7;
    let startY = Game.DIM_Y - (Frog.HEIGHT + ((Game.GRID - Frog.HEIGHT) / 2));
    let frogStartPosition = [startX, startY];
    const frog = new Frog({
      pos: frogStartPosition,
      width: null,
      height: null,
      game: this
    });

    this.add(frog);

    return frog;
  }

  addGoal(goal) {
    this.goalsScored.push(goal);

  } 
  allObjects() {
    return [].concat(this.cars, this.floatingObjects,this.staticObjects, this.frogs);
  }

  checkCollisions() {
    const frog = this.frogs[0];
    // console.log(frog.pos);
    // console.log(frog.isHit);
    if(!frog) return;
    let allObjects = this.allObjects();
    let obj = null;
    let isOnFloatingObj = false;

    for (let i = 0; i < allObjects.length; i++) {
        obj = allObjects[i];
        if(obj instanceof Frog) continue;

        if (frog.isCollidedWith(obj)) {
          const collision = frog.collideWith(obj);
          if (collision) {
            if(obj instanceof FloatingObject) {
              isOnFloatingObj = true;
              return true;
            } else if(obj instanceof Car) {
              console.log("collision detected");
              this.frogLives -= 1;
              this.frogLosesLife(frog);
              //frog.relocateToStart();
            }
            
          }
        }
    }
    if(!isOnFloatingObj) frog.notOnFloatingObject();
    
    if(frog.isInWater()) {
      
      if(frog.stopPos) return;
      this.frogLives -= 1;
      this.frogLosesLife(frog);
    }
  }

  frogLosesLife(frog) {
    console.log(this.frogLives);
    console.log(frog.pos);
    frog.isHit = true;
    frog.isInWater() ? this.sounds.splash.play() : this.sounds.loseLife.play();
    
    let skull = new SkullSymbol({
      pos: [frog.x, frog.y],
      game: this
    });
    frog.relocateToStart();
    this.add(skull);
    if(this.isGameOver()) {
      this.gameOver();
      setTimeout(() => {
        this.remove(skull);
      }, 2000);
    } else {
      setTimeout(() => {
        this.remove(skull);
        frog.isHit = false;
      }, 2000);
    }
  }
  checkGoals() {
    if(!this.frogs[0]) return;
    let frog = this.frogs[0];
    if (frog.y < 50) {
      if (frog.didLandInHomeBase()) {
        let alreadyScored = this.goalsScored.some(goal => goal === frog.lastGoal);
        console.log("IN GOAL");
        if (alreadyScored) {
          this.frogLives -= 1;
          console.log("already scored");
          frog.relocateToStart();
          return;
        }
        this.addGoal(frog.lastGoal);
        this.sounds.scoreGoal.play();
        
        if(this.goalsScored.length === 5) {
          this.messages = "LEVEL UP!";
          this.calculatePoints(Game.LEVEL_COMPLETE);
          frog.relocateOffscreen();
          setTimeout(() => this.sounds.levelUpMusic.play(), 450);
          
          setTimeout( () => {
            this.goalsScored = [];
            frog.relocateToStart();
            this.messages = null;
          }, 2000);

        } else {
          this.calculatePoints(Game.SCORE_GOAL);
          frog.relocateToStart();
        }
        
        
      } else {
        this.frogLives -= 1;
        this.frogLosesLife(frog);
        frog.relocateToStart();
      }
    }
    
  }

  drawMessages(ctx) {
    if(!this.messages) return;

    ctx.fillStyle = "red";
    ctx.font = Game.GRID + "pt Arial ";
    ctx.textAlign = "center";
    ctx.fillText(this.messages, Game.DIM_X / 2, Game.MID_POINT_Y);
  }

  drawScore() {
    let score = document.getElementById("score");
    score.innerHTML = this.score;
  }
  isGameOver() {
    
    return this.frogLives <= 0;
  }

  

  draw(ctx) {

    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.drawBackground(ctx);
    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });

    // draw messgages
    this.drawMessages(ctx);

    //draw score
    this.drawScore();
  }

  isOutOfBounds(pos, width) {
    return (pos[0] < Game.HIDDEN_START_X) ||
      (pos[0] + width > Game.HIDDEN_END_X);
  }

  frogIsOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] + (Game.GRID - 1) > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  gameOver() {
    let frog = this.frogs[0];
    this.remove(frog);
    this.messages = "GAME OVER";
    setTimeout(() => {
      this.messages = null;
    }, 3000);
    
  }

  loadSounds() {
    // Music
    // begin game
    this.addSound("beginGameMusic", "./sounds/begin_game_music.mp3");
    // level up
    this.addSound("levelUpMusic", "./sounds/level_up_music.mp3");

    //Sound Effects
    // frog jumps 
    this.addSound("jump", "./sounds/jump.mp3");
    // loses life
    this.addSound("loseLife", "./sounds/lose_life.mp3");
    // splash
    this.addSound("splash", "./sounds/splash.mp3");
    // score goal
    this.addSound("scoreGoal", "./sounds/score_goal.mp3");

    
  }

  
  addSound(name, sourceUrl) {
    let sound = document.createElement("audio");
    let that = this;
    sound.src = sourceUrl;
    
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    
    //add sound to our list of sounds
    this.sounds[name] = sound;
    //debugger
  }

  // loadOpeningTheme() {
  //   // begin game
  //   this.addSound("beginGameMusic", "./sounds/begin_game_music.mp3");

  //   while(true) {
  //     if(this.sounds.beginGameMusic.readyState === 4) return new Promise(
  //       resolve => { return true; }
  //     );
  //   }
  //   return new Promise(resolve => {});
  // }

  //  playOpeningTheme() {
  //   this.loadOpeningTheme.then(resolve => {this.sounds.beginGameMusic.play();});
  // }
  moveObjects(delta, direction) {
    this.allObjects().forEach((object) => {
     object.move(delta);      
    });
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Frog) {
      this.frogs.splice(this.frogs.indexOf(object), 1);
    } else if (object instanceof SkullSymbol) {
      this.staticObjects.splice(this.staticObjects.indexOf(object), 1);
    } else {
      throw new Error("unknown type of object");
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
    this.checkGoals();
  }

  wrap(pos, width) {
    if(pos[0] < 0) {
      return [
        Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
      ];
    } else if(pos[0] + width > Game.HIDDEN_END_X){
      return [
        Util.wrap(pos[0] + width, Game.DIM_X, width), Util.wrap(pos[1], Game.DIM_Y)
      ];
    }
  }
}

Game.GRID = 40;
Game.BG_COLOR = "#000000";
Game.DIM_X = Game.GRID * 13;
Game.DIM_Y = 560;
Game.HIDDEN_DIM_X = 1680;
Game.HIDDEN_START_X = 0 - (Game.HIDDEN_DIM_X - Game.DIM_X) / 2; 
Game.HIDDEN_END_X = Game.DIM_X + (Game.HIDDEN_DIM_X - Game.DIM_X) / 2; 

Game.MID_POINT_Y = Game.DIM_Y - (240);
Game.END_POINT_Y = Game.DIM_Y - (Game.GRID * 12);
Game.FPS = 32;
Game.NUM_CARS = 1;


// object widths
Game.YELLOW_RACER_WIDTH = Game.GRID * 1.25;
Game.TRACTOR_WIDTH = Game.GRID * 1.15;
Game.SEDAN_WIDTH = Game.GRID * 1.25;
Game.WHITE_RACER_WIDTH = Game.GRID * 1.25;
Game.TRUCK_WIDTH = Game.GRID * 2;
Game.SMALL_LOG_WIDTH = Game.GRID * 3;
Game.MEDIUM_LOG_WIDTH = Game.GRID * 5;
Game.LONG_LOG_WIDTH = Game.GRID * 6;
Game.TWO_TURTLE_PACK_WIDTH = Game.GRID * 2;
Game.THREE_TURTLE_PACK_WIDTH = Game.GRID * 3;

// point system
Game.MOVE_UP = "up";
Game.SCORE_GOAL = "SCORE_GOAL";
Game.LEVEL_COMPLETE = "LEVEL_COMPLETE";
export default Game;

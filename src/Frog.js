import MovingObject from "./MovingObject";
import Car from "./Car";
import FloatingObject from './FloatingObject';
import Util from "./util";
import { Z_BEST_COMPRESSION } from "zlib";

function randomColor() {
  // // const hexDigits = "0123456789ABCDEF";

  // let color = "#";
  // for (let i = 0; i < 3; i++) {
  //   color += hexDigits[Math.floor((Math.random() * 16))];
  // }
 let color = "#FFF";
  return color;
}

const DEFAULTS = {
  COLOR: "#505050",
  SPEED: [0,0]
};

class Frog extends MovingObject {
  constructor(options) {
    options.width = Frog.WIDTH;
    options.height = Frog.HEIGHT;
    options.x = options.pos[0];
    options.y = options.pos[1];
    options.vel = DEFAULTS.SPEED;
    options.color = options.color || randomColor();
    options.image = './images/frog.png';
    options.type = "frog";
    super(options);
    this.game = options.game;
    this.isOnFloatingObj = false;
    this.floatingObj = null;
    this.lastGoal = false;
    this.startPos = null;
    this.stopPos = null;
  }

  didLandInHomeBase() {
    for (let i = 0; i < this.game.homeBaseGoals.length; i++) {
      let base = this.game.homeBaseGoals[i];
      if(this.x >= base.left && (this.x + this.width) <= base.right) {
        this.lastGoal = base;
        return true;
      } 
    }
   return false;
  }

  moveFrog(direction) {
    if(this.willBeOutOfBounds(direction)) return;

    switch(direction) {
      case "LEFT":
        this.stopPos = [this.pos[0] - this.game.grid, this.pos[1]];
        this.startPos = [this.pos[0], this.pos[1]];
        if(this.willBeOutOfBounds(this.stopPos)) return;
        this.vel = [-5,0];
        this.moveDir = "left";
        break; 
      case "RIGHT":
        this.stopPos = [this.pos[0] + this.game.grid, this.pos[1]];
        this.startPos = [this.pos[0], this.pos[1]];
        if (this.willBeOutOfBounds(this.stopPos)) return;
        this.vel = [5, 0];
        this.moveDir = "right";
        break; 
      case "UP":
        this.stopPos = [this.pos[0], this.pos[1] - this.game.grid];
        this.startPos = [this.pos[0], this.pos[1]];
        this.vel = [0, -5];
        this.moveDir = "up";
        break; 
      case "DOWN":
        this.stopPos = [this.pos[0], this.pos[1] + this.game.grid];
        this.startPos = [this.pos[0], this.pos[1]];
        if (this.willBeOutOfBounds(this.stopPos)) return;
        this.vel = [0, 5];
        this.moveDir = "down";
        break; 
    }
    if(this.game.sounds.jump.ended) {
      this.game.sounds.jump.play();
    } else {
      this.game.sounds.jump.currentTime = 0;
      this.game.sounds.jump.play();
    }
  }
  landOnFloatingObject(floatingObj) {
    this.isOnFloatingObj = true;
    this.floatingObj = floatingObj;
    this.vel = floatingObj.vel;
  }


  notOnFloatingObject() {
    if(this.stopPos) return;
    this.isOnFloatingObj = false;
    this.floatingObj = null;
    this.vel = [0,0];
  }
  collideWith(otherObject) {
    if (otherObject instanceof Car) {
      // play "splat" animation or something
      return true;
    } else if (otherObject instanceof FloatingObject) {
      if(this.stopPos) return;
      // enter "frog on log?" rules here
      this.landOnFloatingObject(otherObject);
      return true;
    } else {
    }

    return false;
  }
  isInWater() {
    
    if (this.y < (this.game.midPointY - this.game.grid) && this.y >= 
          40) {
      if (!this.isOnFloatingObj) {
        return true;
      }
      return false;
    }
  }
  relocateToStart() {
    if(this.game.frogLives === 0) return;

    let startX = (this.game.width / 2) - (Frog.WIDTH / 2);
    let startY = this.game.height - (Frog.HEIGHT + ((this.game.grid - Frog.HEIGHT) / 2));
    this.pos = [startX, startY];
    this.vel = [0,0];
  }
  relocateOffscreen() {
    this.pos = [300, this.game.height + 100];
    this.vel = [0, 0];
  }

  willBeOutOfBounds(pos) {
    return this.game.frogIsOutOfBounds(pos);
  }
}

Frog.WIDTH = 30;
Frog.HEIGHT = 30;
export default Frog;

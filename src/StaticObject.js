const Util = require("./util");
import Frog from './Frog';


class StaticObject {
  constructor(options) {
    this.pos = options.pos;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.radius = options.radius;
    this.game = options.game;
    this.type = options.type;
    this.image = options.image;
    this.tick = 0;
    this.tick2 = 0;

    this.img = new Image();
    this.img.src = this.image;
  }

  collideWith(otherObject) {
    // default do nothing
  }

  draw(ctx) {
    if (this.game.frogs[0] && this.game.frogs[0].stopPos) {
          this.pos[0] = this.game.frogs[0].stopPos[0];
          this.pos[1] = this.game.frogs[0].stopPos[1];
          this.game.frogs[0].stopPos = null;
        } 
        ctx.drawImage(this.img, this.pos[0], this.pos[1]);
  }

  rotationDegrees() {
    switch(this.moveDir) {
      case "up":
        return 0;
      case "right":
        return 90;
      case "down":
        return 180;
      case "left":
        return 270;
    }
  }

  isCollidedWith(otherObject) {
  
  }

  loadAnimationFrames(type) {
    switch(type) {
    }
  }

  getAnimationFrame() {
    let axis = null;
    if(this.moveDir === "left" || this.moveDir === "right" ) {
      axis = 0;
    } else {
      axis = 1;
    }
    let frameUnits = this.game.grid / this.animationFrames.length;
    let progress = Math.abs(this.startPos[axis] - this.pos[axis]);
  
    let frame = Math.floor(progress / frameUnits) % this.animationFrames.length;
    return this.animationFrames[frame];
  }

  move(timeDelta) {
  }

  remove() {
    this.game.remove(this);
  }
}

export default StaticObject;
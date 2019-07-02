const Util = require("./util");
import Frog from './Frog';


class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.x = options.x;
    this.y = options.y;
    this.vel = options.vel;
    this.width = options.width;
    this.height = options.height;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
    this.type = options.type;
    this.image = options.image;
    this.tick = 0;
    this.tick2 = 0;
    this.moveDir = null;

    switch (options.type) {
      case "truck":
        this.image = './images/truck.png';
        break;
      case "yellow-racer":
        this.image = './images/yellow_racer.png';
        break;
      case "blue-racer":
        this.image = './images/blue_racer.png';
        break;
      case "green-racer":
        this.image = './images/green_racer.png';
        break;
      case "short-log":
        this.image = './images/short_log.png';
        break;
      case "medium-log":
        this.image = './images/medium_log.png';
        break;
      case "long-log":
        this.image = './images/long_log.png';
        break;
      case "frog":
        this.image = './images/frog.png';
        // animation frames
        this.image1 = './images/frog_animation/frog_anim_1.png';
        this.image2 = './images/frog_animation/frog_anim_2.png';
        this.image3 = './images/frog_animation/frog_anim_3.png';
        this.image4 = './images/frog_animation/frog_anim_4.png';
        this.image5 = './images/frog_animation/frog_anim_5.png';
        this.image6 = './images/frog_animation/frog_anim_6.png';
        this.image7 = './images/frog_animation/frog_anim_7.png';
        this.loadAnimationFrames("frog");
        break;
      case "turtles-2":
        this.image = './images/turtle.png';
        // animation frames
        this.image1 = './images/turtle_animations/turtle_anim_1.png';
        this.image2 = './images/turtle_animations/turtle_anim_2.png';
        this.image3 = './images/turtle_animations/turtle_anim_3.png';
        this.image4 = './images/turtle_animations/turtle_anim_4.png';
        this.image5 = './images/turtle_animations/turtle_anim_5.png';
        this.image6 = './images/turtle_animations/turtle_anim_6.png';
        this.image7 = './images/turtle_animations/turtle_anim_7.png';
        this.loadAnimationFrames("turtle");
        break;
      case "turtles-3":
        this.image = './images/turtle.png';
        // animation frames
        this.image1 = './images/turtle_animations/turtle_anim_1.png';
        this.image2 = './images/turtle_animations/turtle_anim_2.png';
        this.image3 = './images/turtle_animations/turtle_anim_3.png';
        this.image4 = './images/turtle_animations/turtle_anim_4.png';
        this.image5 = './images/turtle_animations/turtle_anim_5.png';
        this.image6 = './images/turtle_animations/turtle_anim_6.png';
        this.image7 = './images/turtle_animations/turtle_anim_7.png';
        this.loadAnimationFrames("turtle");
        break;
      case "fire-truck":
        this.image = './images/fire_truck.png';
        break;
      case "":
        this.image = './images/turtle.png';
        break;
    }

    if(this.image) {
      this.img = new Image();
      this.img.src = this.image;
    }
  }

  collideWith(otherObject) {
    // default do nothing
  }

  draw(ctx) {
    if(this instanceof Frog) {
      let img = new Image();
      if(this.isHit) {
        img.src = '';
      } else {
        img.src = this.image1;
        if (this.stopPos) {
          img = this.getAnimationFrame();
        }
      }
      
      
      // get center point coords for current grid square
      let centerPoint = [this.pos[0] + 0.5 * this.width, this.pos[1] + 0.5 * this.height];
      
      ctx.save();
      // change direction of the frog by rotating the canvas
      ctx.translate(centerPoint[0], centerPoint[1]);
      let degrees = this.rotationDegrees();
      ctx.rotate(Math.PI/180 * degrees);
      ctx.drawImage(img, -(0.5 * img.naturalWidth), -(0.5 * img.naturalHeight));


      // aftr drawing frog, rotate canvas back to original position
      ctx.restore();
      
      return;
    } else {
      ctx.fillStyle = this.color;
      if(this.image && this.type !== "turtles-2" && this.type !=="turtles-3") {
        
        ctx.drawImage(this.img, this.pos[0], this.pos[1]);
      } else if (this.image && (this.type === "turtles-3" || this.type === "turtles-2")) {
        
          // ctx.drawImage(this.img, this.pos[0], this.pos[1]);
          // ctx.drawImage(this.img, this.pos[0] + 40, this.pos[1]);
        let frame = (Math.round(this.tick / 5)) % 7;
        //this.y = this.calculateYStart(this.animationFrames[frame].height);

        ctx.drawImage(this.animationFrames[frame], this.pos[0], this.pos[1]);
        ctx.drawImage(this.animationFrames[frame], this.pos[0] + 40, this.pos[1]);
        
        if (this.type === "turtles-3") ctx.drawImage(this.animationFrames[frame], this.pos[0] + 80, this.pos[1]);
        this.tick += 1;
        } else {
        ctx.beginPath();
        ctx.fillRect(this.pos[0],this.pos[1],this.width,this.height); 
        ctx.fill();
      }
    }
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
    
    let isCollided = !(this.x + this.width < otherObject.x ||
              this.x > otherObject.x + otherObject.width ||
              this.y + this.height < otherObject.y ||
              this.y > otherObject.y + otherObject.height);
    return isCollided;
    
  }

  calculateYStart(imgHeight) {
    if(this.lastImgHeight < imgHeight) {
      let diff = Math.round((imgHeight - this.lastImgHeight) / 2);
      
      return this.y + diff;
    } else if(this.lastImgHeight > imgHeight) {
      let diff = Math.round((this.lastImgHeight - imgHeight) / 2);
      return this.y - diff;
    }
    return this.y;
  }
  loadAnimationFrames(type) {
    switch(type) {
      case "turtle":
        this.img1 = new Image();
        this.img1.src = this.image1;

        this.img2 = new Image();
        this.img2.src = this.image2;

        this.img3 = new Image();
        this.img3.src = this.image3;

        this.img4 = new Image();
        this.img4.src = this.image4;

        this.img5 = new Image();
        this.img5.src = this.image5;

        this.img6 = new Image();
        this.img6.src = this.image6;

        this.img7 = new Image();
        this.img7.src = this.image7;
        this.animationFrames = [this.img1, this.img2, this.img3, this.img4, this.img5, this.img6, this.img7];
        break;
      case "frog":
        this.img1 = new Image();
        this.img1.src = this.image1;

        this.img2 = new Image();
        this.img2.src = this.image2;

        this.img3 = new Image();
        this.img3.src = this.image3;

        this.img4 = new Image();
        this.img4.src = this.image4;

        this.img5 = new Image();
        this.img5.src = this.image5;

        this.img6 = new Image();
        this.img6.src = this.image6;

        this.img7 = new Image();
        this.img7.src = this.image7;
        this.animationFrames = [this.img1, this.img2, this.img3, this.img4, this.img5, this.img6, this.img7];
        break;
        
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
    if(this.isHit) return;
    // stop object from moving if it has reached it's destination
    if(this.stopPos) {
      let stopped = false;
      
     switch(this.moveDir) {
       case "left":
         if (this.pos[0] <= this.stopPos[0]) stopped = true;
         break;
       case "right":
         if (this.pos[0] >= this.stopPos[0]) stopped = true;
         break;
       case "up":
         if (this.pos[1] <= this.stopPos[1]) stopped = true;
         break;
       case "down":
         if (this.pos[1] >= this.stopPos[1]) stopped = true;
         break;
         default:
         
     }
      if(stopped) {
        this.vel = [0, 0];
      this.pos = this.stopPos;
      this.stopPos = null;
      this.startPos = null;
      this.game.calculatePoints(this.moveDir);
      }
    }
      
    

    // timeDelta is number of milliseconds since last move
    // if the computer is busy the time delta will be larger
    // in this case the MovingObject should move farther in this frame
    // velocity of object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;


    this.pos = [this.pos[0] + Math.round(offsetX), this.pos[1] + Math.round(offsetY)];
    this.x = this.pos[0] + Math.round(offsetX);
    this.y = this.pos[1] + Math.round(offsetY);
    
    if (this.game.isOutOfBounds(this.pos, this.width)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos, this.width);
      } else {
        this.remove();
      }
    }

  }

  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

export default MovingObject;
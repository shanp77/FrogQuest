import Util from "./util";
import MovingObject from "./MovingObject";
import Frog from "./Frog";

const DEFAULTS = {
  COLOR: "#505050",
  RADIUS: 25,
  SPEED: 4
};

class Car extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.x = options.pos[0];
    options.y = options.pos[1];
    options.vel = options.vel || DEFAULTS.SPEED;
    options.width = options.width || Car.WIDTH;
    options.height = options.height || Car.HEIGHT;
    super(options);
  }
}

Car.WIDTH = 50;
Car.HEIGHT = 32;
export default Car;

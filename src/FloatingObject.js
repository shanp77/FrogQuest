const Util = require("./util");
import MovingObject from "./MovingObject";
import Frog from "./Frog";

const DEFAULTS = {
  COLOR: "#505050",
  SPEED: 4
};

class FloatingObject extends MovingObject {
  constructor(options = {}) {
    options.color = DEFAULTS.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.x = options.pos[0];
    options.y = options.pos[1];
    options.vel = options.vel || DEFAULTS.SPEED;
    options.width = options.width ||FloatingObject.WIDTH;
    options.height = FloatingObject.HEIGHT;
    super(options);
  }

  collideWith(otherObject) {
    if (otherObject instanceof Frog) {
      return true;
    }

    return false;
  }
}

FloatingObject.WIDTH = 50;
FloatingObject.HEIGHT = 40;
export default FloatingObject;

import Game from "./Game";
import StaticObject from './StaticObject';


class SkullSymbol extends StaticObject {
  constructor(options) {
    options.width = SkullSymbol.WIDTH;
    options.height = SkullSymbol.HEIGHT;
    options.x = options.pos[0];
    options.y = options.pos[1];
    options.image = './images/skull.png';
    options.type = "skull";
    super(options);
    this.game = options.game;
  }
}

SkullSymbol.WIDTH = 30;
SkullSymbol.HEIGHT = 30;

export default SkullSymbol;

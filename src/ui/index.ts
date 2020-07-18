import {
  Game,
  Scene
} from "phaser";

import "./index.scss";

class HelloWorldScene extends Scene
{
  public constructor()
  {
    super("helloWorld");
  }

  public create()
  {
    const helloMessage = this.add.text(this.scale.width / 2, 100, "Hello, World!");
    helloMessage.setOrigin(0.5);
  }
}

new Game({
  "type"  : Phaser.AUTO,

  "physics" : {
    "default" : "arcade"
  },

  "render"  : {
    "pixelArt"    : true,
    "roundPixels" : true
  },

  "scale" : {
    "mode"  : Phaser.Scale.RESIZE
  },

  "scene" : [
    HelloWorldScene
  ]
});

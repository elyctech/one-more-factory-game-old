import {
  Game
} from "phaser";

import BootScene        from "./scenes/boot/index.class";
import Prototype1Scene  from "./scenes/prototype1/index.class";
import Prototype2Scene  from "./scenes/prototype2/index.class";
import Prototype3Scene  from "./scenes/prototype3/index.class";
import Prototype4Scene  from "./scenes/prototype4/index.class";

import "./index.scss";

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
    BootScene,
    Prototype1Scene,
    Prototype2Scene,
    Prototype3Scene,
    Prototype4Scene
  ]
});

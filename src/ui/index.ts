import {
  Game
} from "phaser";

import BootScene        from "./scenes/boot/index.class";
import Prototype1Scene  from "./scenes/prototype1/index.class";

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
    Prototype1Scene
  ]
});

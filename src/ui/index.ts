import {
  Game,
  Scene
} from "phaser";

import environmentImage from "./assets/environment-extruded.png";
import landscapeJson    from "./assets/proto1-landscape.json";
import objects1Image    from "./assets/objects1.png";

import "./index.scss";

class BootScene extends Scene
{
  public constructor()
  {
    super("boot");
  }

  public preload()
  {
    // Landscape

    this.load.tilemapTiledJSON(
      "environmentTilemap",
      landscapeJson
    );

    this.load.image(
      "environmentTileset",
      environmentImage
    );

    // Objects

    this.load.spritesheet(
      "objects1",
      objects1Image,
      {
        "frameHeight" : 32,
        "frameWidth"  : 32
      }
    );
  }

  public create() : void
  {
    this.scene.start("helloWorld");
  }
}

class HelloWorldScene extends Scene
{
  public constructor()
  {
    super("helloWorld");
  }

  public create()
  {
    // Landscape

    const tileMap = this.make.tilemap({
      "key" : "environmentTilemap",
    });

    const tiles = tileMap.addTilesetImage(
      "environment",
      "environmentTileset",
      32,
      32,
      1,
      2
    );

    tileMap.createStaticLayer(
      "Base 1",
      tiles
    );

    // Animations

    // Conveyer belt
    this.anims.create({
      "key"       : "conveyerBelt",
      "frameRate" : 6,
      "repeat"    : -1,
      "frames"  : this.anims.generateFrameNumbers(
        "objects1",
        {
          "frames"  : [0, 8, 16, 24]
        }
      )
    });

    // Scene

    // Conveyer belts
    this.placeConveyerBelt(128, 96);
    this.placeConveyerBelt(160, 96);
    this.placeConveyerBelt(192, 96);
    this.placeConveyerBelt(224, 96);
  }

  private placeConveyerBelt(
    x : number,
    y : number
  ) : void
  {
    const conveyerBelt = this.add.sprite(
      x,
      y,
      "objects1",
      0
    );

    conveyerBelt.play(
      "conveyerBelt"
    );
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
    BootScene,
    HelloWorldScene
  ]
});

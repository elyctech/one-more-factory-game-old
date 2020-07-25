import {
  Game,
  Scene
} from "phaser";

import environmentImage   from "./assets/environment-extruded.png";
import environment2Image  from "./assets/environment2-extruded.png";
import objects1Image      from "./assets/objects1.png";

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

    this.load.image(
      "environmentTileset",
      environmentImage
    );

    this.load.spritesheet(
      "environment2Tileset",
      environment2Image,
      {
        "frameHeight" : 32,
        "frameWidth"  : 32
      }
    );

    // Objects

    this.load.spritesheet(
      "objects1Tileset",
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

    const mapHeight = 32;
    const mapWidth  = 128;

    const landscape : number[][] = [];

    // Lay random tiles

    for (let i = 0; i < mapHeight; i += 1)
    {
      landscape[i] = [];

      for (let j = 0; j < mapWidth; j += 1)
      {
        landscape[i][j] = Math.floor(Math.random() * 3) * 4;
      }
    }

    const tileMap = this.make.tilemap({
      "data"        : landscape,
      "tileHeight"  : 32,
      "tileWidth"   : 32
    });

    const tiles = tileMap.addTilesetImage(
      "environment",
      "environment2Tileset",
      32,
      32,
      1,
      2
    );

    tileMap.createStaticLayer(
      0,
      tiles
    );

    // Animations

    // Conveyer belt
    this.anims.create({
      "key"       : "conveyerBelt",
      "frameRate" : 12,
      "repeat"    : -1,
      "frames"  : this.anims.generateFrameNumbers(
        "objects1Tileset",
        {
          "frames"  : [0, 8, 16, 24]
        }
      )
    });

    // Scene

    // Coal
    this.add.sprite(
      128,
      64,
      "environment2Tileset",
      1
    );

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
      "objects1Tileset",
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

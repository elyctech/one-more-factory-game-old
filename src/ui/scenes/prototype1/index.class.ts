import {
  Scene
} from "phaser";

class Prototype1Scene extends Scene
{
  public constructor()
  {
    super("prototype1");
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

export default Prototype1Scene;

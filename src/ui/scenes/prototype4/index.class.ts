import {
  Scene
} from "phaser";

class Prototype4Scene extends Scene
{
  public constructor()
  {
    super("prototype4");
  }

  public create() : void
  {
    // Landscape

    this.createLandscape();
  }

  public createLandscape() : void
  {
    const mapHeight = 32;
    const mapWidth  = 128;

    const landscape : number[][] = [];

    // Lay random tiles

    for (let i = 0; i < mapHeight; i += 1)
    {
      landscape[i]  = [];

      // Fill the row with random terrain
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
  }
}

export default Prototype4Scene;

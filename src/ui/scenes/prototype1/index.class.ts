import {
  Scene
} from "phaser";

const objectsMenuService = {
  createMenu(
    objects : {
      frame   : number,
      sprite  : string
    }[],
    scene : Scene
  ) : {
    hide()    : void;
    isShown() : boolean;
    show()    : void;
  } {
    const x = scene.scale.width / 2;
    const y = scene.scale.height / 2;

    const columns = Math.ceil(Math.sqrt(objects.length));
    const rows    = Math.ceil(objects.length / columns);

    const rowWidth  = columns * 32;
    const rowHeight = rows * 32;

    const container = scene.add.rectangle(
      x,
      y,
      rowWidth + 8,
      rowHeight + 8,
      0x666666,
      0.8
    );

    const grid  = scene.add.grid(
      x,
      y,
      rowWidth,
      rowHeight,
      32,
      32,
      0x444444
    );

    const objectsMenuGroup  = scene.add.group([
      container,
      grid
    ]);

    for (let i = 0; i < objects.length; i += 1)
    {
      const object = objects[i];

      const cellX = i % columns - columns / 2;
      const cellY = Math.floor(i / columns) - rows / 2;

      objectsMenuGroup.add(
        scene.add.sprite(
          x + 32 * cellX + 16,
          y + 32 * cellY + 16,
          object.sprite,
          object.frame
        )
      );
    }

    const objectsMenu  = {
      hide() : void
      {
        objectsMenuGroup.setActive(false);
        objectsMenuGroup.setVisible(false);
      },

      isShown() : boolean
      {
        return objectsMenuGroup.active;
      },

      show()  : void
      {
        objectsMenuGroup.setActive(true);
        objectsMenuGroup.setVisible(true);
      }
    }

    objectsMenu.hide();

    return objectsMenu;
  }
}

enum TileType
{
  CoalNode,
  Terrain
}

class Prototype1Scene extends Scene
{
  private tileTypes : number[][] = [];

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
      landscape[i]      = [];
      this.tileTypes[i] = [];

      for (let j = 0; j < mapWidth; j += 1)
      {
        landscape[i][j]       = Math.floor(Math.random() * 3) * 4;
        this.tileTypes[i][j]  = TileType.Terrain;
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
    this.tileTypes[2][4] = TileType.CoalNode;

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

    // Objects menu

    let objectsMenu = objectsMenuService.createMenu(
      [
        {
          "frame"   : 0,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 32,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 32,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 0,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 32,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 0,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 32,
          "sprite"  : "objects1Tileset"
        },
        {
          "frame"   : 0,
          "sprite"  : "objects1Tileset"
        }
      ],
      this
    );

    this.input.keyboard.on(
      "keyup-OPEN_BRACKET",
      ()  : void =>
      {
        if (objectsMenu.isShown())
        {
          objectsMenu.hide()
        }
        else
        {
          objectsMenu.show()
        }
      }
    );
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

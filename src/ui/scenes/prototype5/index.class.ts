import {
  Scene
} from "phaser";

enum EntityOrientation
  {
  Down,
  Left,
  Right,
  Up
}

interface Material
{
  x : number;
  y : number;
}

interface Entity
{
  acceptsMaterial(
    material  : Material
  ) : boolean;
}

class ManualMiner implements Entity
{
  public acceptsMaterial()  : boolean
  {
    return false;
  }
}

class StraightBelt1 implements Entity
{
  public constructor(
    private orientation : EntityOrientation,
    private x           : number,
    private y           : number
  )
  {

  }

  public acceptsMaterial(
    material  : Material
  ) : boolean
  {
    let willAccept  = false;

    if (this.orientation === EntityOrientation.Down)
    {
      willAccept = material.x === this.x && material.y === this.y - 1;
    }
    else if (this.orientation === EntityOrientation.Left)
    {
      willAccept = material.x === this.x - 1 && material.y === this.y;
    }
    else if (this.orientation === EntityOrientation.Right)
    {
      willAccept = material.x === this.x + 1 && material.y === this.y;
    }
    else
    {
      willAccept = material.x === this.x && material.y === this.y + 1;
    }

    return willAccept;
  }
}

class Prototype5Scene extends Scene
{
  private entities  : Map<number, Map<number, Entity>>;

  public constructor()
  {
    super("prototype5");

    this.entities = new Map();
  }

  public create() : void
  {
    // Instructions

    this.createInstructions();

    // Landscape

    this.createLandscape();

    // Animations

    this.anims.create({
      "duration"  : 300,
      "key"       : "belt1",
      "repeat"    : -1,
      "frames"    : this.anims.generateFrameNumbers(
        "objects1Tileset",
        {
          "frames"  : [0, 1, 2, 3]
        }
      )
    });

    this.anims.create({
      "duration"  : 300,
      "key"       : "belt1Right",
      "repeat"    : -1,
      "frames"    : this.anims.generateFrameNumbers(
        "objects1Tileset",
        {
          "frames"  : [24, 25, 26, 27]
        }
      )
    });

    // Miners

    // One

    this.createMiner(
      4,
      3,
      "",
      "No can do."
    );

    // Two

    this.createMiner(
      8,
      3,
      "",
      "Allllllmost."
    );

    this.createStraightBelt(
      8,
      4,
      EntityOrientation.Left
    );

    // Three

    this.createMiner(
      12,
      3,
      "Here ya go!",
      "Something is in the way."
    );

    this.createStraightBelt(
      12,
      4,
      EntityOrientation.Down
    );

    // Four

    this.createMiner(
      16,
      3,
      "Plop!",
      "Just wait a gosh darned minute!"
    );
  }

  private createStraightBelt(
    x           : number,
    y           : number,
    orientation : EntityOrientation
  ) : void
  {
    const sprite = this.addSprite(
      x,
      y,
      new StraightBelt1(
        orientation,
        x,
        y
      ),
      "objects1Tileset",
      0
    );

    if (orientation === EntityOrientation.Down)
    {
      sprite.rotation = Math.PI * 0.5;
    }
    else if (orientation === EntityOrientation.Right)
    {
      sprite.rotation = Math.PI;
    }
    else if (orientation === EntityOrientation.Up)
    {
      sprite.rotation = Math.PI * -0.5;
    }

    sprite.anims.play(
      "belt1",
    );

    sprite.anims.setProgress(
      (window.performance.now() / 250) % 1
    );
  }

  private createMiner(
    x               : number,
    y               : number,
    successMessage  : string,
    failureMessage  : string
  ) : void
  {
    const sprite = this.addSprite(
      x,
      y,
      new ManualMiner(),
      "objects1Tileset",
      4
    );

    sprite.setInteractive();

    sprite.on(
      "pointerdown",
      () : void =>
      {
        // Choose message

        const entity  = this.getEntity(
          x,
          y + 1
        );

        const messageText = entity?.acceptsMaterial({x, y}) ? successMessage : failureMessage;

        // Show message

        const message  = this.add.text(
          sprite.x,
          sprite.y - 16,
          messageText
        );

        message.x -= message.width / 2;

        const interval = setInterval(
          () => message.y -= 1,
          32
        );

        setTimeout(
          () : void =>
          {
            clearInterval(
              interval
            );

            message.destroy();
          },
          750
        );
      }
    );
  }

  private addSprite(
    x       : number,
    y       : number,
    entity  : Entity,
    texture : string,
    frame   : number
  ) : Phaser.GameObjects.Sprite
  {
    this.addEntity(
      entity,
      x,
      y
    );

    return this.add.sprite(
      x * 32,
      y * 32,
      texture,
      frame
    );
  }

  private addEntity(
    entity  : Entity,
    x       : number,
    y       : number
  ) : void
  {
    let column  = this.entities.get(x);

    if (!column)
    {
      column = new Map();

      this.entities.set(x, column);
    }

    column.set(y, entity);
  }

  private getEntity(
    x : number,
    y : number
  ) : Entity | null
  {
    return this.entities.get(x)?.get(y) || null;
  }

  private hasEntity(
    x : number,
    y : number
  ) : boolean
  {
    return this.entities.get(x)?.has(y) || false;
  }

  private createInstructions() : void
  {
    // Instructions

    // this.add.rectangle(
    //   this.scale.width - 100,
    //   12,
    //   200,
    //   24,
    //   0x000000,
    //   0.6
    // ).setDepth(10);

    // this.add.text(
    //   this.scale.width - 190,
    //   0,
    //   "Wait for it..."
    // ).setDepth(10);
  }

  private createLandscape() : void
  {
    const mapHeight = 32;
    const mapWidth = 128;

    const landscape : number[][] = [];

    // Lay random tiles

    for (let i = 0; i < mapHeight; i += 1)
    {
      landscape[i] = [];

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

export default Prototype5Scene;

import {
  Scene
} from "phaser";

type MaterialType = "coal";

type StructureType  = "miner1";

interface Material
{

}

enum StructureOrientation
  {
  Down,
  Left,
  Right,
  Up
}

interface Structure
{
  ticks() : boolean;
}

class IdleStructure implements Structure
{
  public ticks()  : boolean
  {
    return false;
  }
}

abstract class TickingStructure implements Structure
{
  public ticks()  : boolean
  {
    return true;
  }

  public abstract tick(
    time  : DOMHighResTimeStamp,
    delta : number
  ) : void;
}

interface Consumer
{
  acceptsMaterialType(
    material  : MaterialType
  ) : boolean;

  give(
    material  : Material
  ) : void;
}

abstract class TickingProducer extends TickingStructure
{
  private nextEmit  : DOMHighResTimeStamp;

  private productionRate  : number;

  protected emitBlocked : boolean;

  public constructor(
    productionYield : number
  ) {
    super();

    this.emitBlocked    = false;
    this.nextEmit       = 0;
    this.productionRate = 1000 / productionYield;
  }

  public tick(
    time  : DOMHighResTimeStamp
  ) : void
  {
    if (this.emitBlocked || time - this.nextEmit > this.productionRate)
    {
      this.tryEmitting();

      this.nextEmit += this.productionRate;
    }
  }

  // Abstract methods

  public abstract emitToConsumer(
    receiver  : Consumer
  ) : void;

  protected abstract tryEmitting()  : void
}

class Miner extends TickingProducer
{
  public constructor(
    private colliderSprite  : Phaser.Physics.Arcade.Sprite,
    private orientation     : StructureOrientation,

    miningYield : number
  ) {
    super(
      miningYield
    );
  }

  public emitToConsumer(
    receiver  : Consumer
  ) : void
  {
    this.emitBlocked  = receiver.acceptsMaterialType(
      "coal"
    );

    if (
      !this.emitBlocked
    ) {
      receiver.give(
        {}
      );
    }
  }

  protected tryEmitting()  : void
  {
    // Send out invisible collider
    // Other game logic handles what happens next.
    if (this.orientation === StructureOrientation.Down)
    {
      this.colliderSprite.y += 32;
    }
    else if (this.orientation === StructureOrientation.Left)
    {
      this.colliderSprite.x -= 32;
    }
    else if (this.orientation === StructureOrientation.Right)
    {
      this.colliderSprite.x += 32;
    }
    else if (this.orientation === StructureOrientation.Up)
    {
      this.colliderSprite.y -= 32;
    }
  }
}

class Miner1 extends Miner
{
  public constructor(
    colliderSprite  : Phaser.Physics.Arcade.Sprite,
    orientation     : StructureOrientation,
  ) {
    super(
      colliderSprite,
      orientation,
      1
    );
  }
}

interface GameObjectService
{
  spawnStructure(
    type  : StructureType,
    x     : number,
    y     : number
  ) : Structure;
}

const gameObjectServiceFactory  = {
  construct(
    scene : Scene
  ) : GameObjectService
  {
    return {
      spawnStructure(
        type  : StructureType,
        x     : number,
        y     : number
      ) : Structure
      {
        if (type === "miner1")
        {
          // TODO Player defined
          return new Miner1(
            scene.physics.add.sprite(x * 32, y * 32, type, 32),
            StructureOrientation.Down
          );
        }

        throw new Error(
          `Could not create structure: Unknown structure type (${type})`
        );
      }
    };
  }
};

class Prototype2Scene extends Scene
{
  private tickers : TickingStructure[];

  public constructor()
  {
    super("prototype2");

    this.tickers = [];
  }

  public create() : void
  {
    // Landscape

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

    // Spawn structures

    const gameObjectService = gameObjectServiceFactory.construct(
      this
    );

    const miner1  = gameObjectService.spawnStructure(
      "miner1",
      4,
      4
    );

    this.tickers.push(
      miner1
    );
  }

  public update(
    time  : DOMHighResTimeStamp,
    delta : number
  ) : void
  {
    for (const structure of this.tickers)
    {
      structure.tick(
        time,
        delta
      );
    }
  }
}

export default Prototype2Scene;

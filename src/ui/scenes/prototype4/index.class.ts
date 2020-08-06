import {
  Scene
} from "phaser";

interface Material
{
  getSprite() : Phaser.GameObjects.Sprite;
}

class StandardMaterial implements Material
{
  public constructor(
    private sprite  : Phaser.GameObjects.Sprite
  ) {

  }

  public getSprite()  : Phaser.GameObjects.Sprite
  {
    return this.sprite;
  }
}

interface Consumer
{
  consumer  : true;

  consumesMaterial(
    material  : Material
  ) : boolean;

  giveMaterial(
    material  : Material
  ) : void;
}

interface NonConsumer
{
  consumer  : false;
}

interface NonTickingStructure
{
  ticks : false;
}

interface TickingStructure
{
  ticks : true;

  tick(
    worldTime : DOMHighResTimeStamp,
    delta     : number
  ) : void;
}

type Structure  = (Consumer | NonConsumer) & (TickingStructure | NonTickingStructure);

interface MaterialProducedEvent
{
  checkMaterial() : Material;

  getX()  : number;

  getY()  : number;

  hasBeenTaken()  : boolean;

  takeMaterial()  : Material;
}

class StandardMaterialProducedEvent implements MaterialProducedEvent
{
  private beenTaken : boolean;

  public constructor(
    private material  : Material,
    private x         : number,
    private y         : number
  ) {
    this.beenTaken  = false;
  }

  public checkMaterial()  : Material
  {
    return this.material;
  }

  public getX() : number
  {
    return this.x;
  }

  public getY() : number
  {
    return this.y;
  }

  public hasBeenTaken() : boolean
  {
    return this.beenTaken;
  }

  public takeMaterial() : Material
  {
    this.beenTaken  = true;

    return this.material;
  }
}

type MaterialProducedListener = (
  event : MaterialProducedEvent
) => void;

type MaterialProducedListenerRemover  = () => void;

// TODO Interface
class MaterialProducedListenerManager
{
  private listeners : MaterialProducedListener[];

  public constructor()
  {
    this.listeners  = [];
  }

  public addListener(
    listener  : MaterialProducedListener
  ) : MaterialProducedListenerRemover
  {
    this.listeners.push(
      listener
    );

    return () : void =>
    {
      const index = this.listeners.indexOf(
        listener
      );

      if (index > -1)
      {
        this.listeners.splice(index, 1);
      }
    };
  }

  public emitMaterial(
    event : MaterialProducedEvent
  ) : void
  {
    for (const listener of this.listeners)
    {
      listener(
        event
      );

      if (event.hasBeenTaken())
      {
        break;
      }
    }
  }
}

interface MaterialProducer
{
  listenForMaterial(
    listener  : MaterialProducedListener
  ) : MaterialProducedListenerRemover;
}

class Belt1 implements Consumer, MaterialProducer, TickingStructure
{
  public consumer : true  = true;
  public ticks    : true  = true;

  private currentMaterial : Material | null;
  private materialProducedListeners : MaterialProducedListenerManager;

  public constructor(
    private sprite  : Phaser.GameObjects.Sprite,
    private tileX   : number,
    private tileY   : number
  ) {
    this.currentMaterial  = null;

    // TODO Inject
    this.materialProducedListeners  = new MaterialProducedListenerManager();
  }

  public consumesMaterial() : boolean
  {
    return this.currentMaterial === null;
  }

  public giveMaterial(
    material  : Material
  ) : void
  {
    this.currentMaterial  = material;
  }
  public listenForMaterial(
    listener  : MaterialProducedListener
  ) : MaterialProducedListenerRemover
  {
    return this.materialProducedListeners.addListener(
      listener
    );
  }

  public tick(
    _worldTime : DOMHighResTimeStamp,
    delta     : number
  ) : void
  {
    // TODO Orientation
    if (this.currentMaterial)
    {
      const materialSprite  = this.currentMaterial.getSprite();

      if (materialSprite.x > this.sprite.x + this.sprite.width / 2)
      {
        const event = new StandardMaterialProducedEvent(
          this.currentMaterial,
          this.tileX + 1,
          this.tileY
        );

        this.materialProducedListeners.emitMaterial(
          event
        );

        if (event.hasBeenTaken())
        {
          this.currentMaterial  = null;
        }
      }
      else
      {
        const rate  = 16 / 250; // 16 px per 250 ms
        materialSprite.x  += rate * delta;
      }
    }
  }
}

class StandardPlacedStructureManager
{
  private structures  : Map<number, Map<number, Structure>>;

  public constructor()
  {
    this.structures = new Map();
  }

  public getStructureAt(
    x : number,
    y : number
  ) : Structure | null
  {
    return this.structures.get(x)?.get(y) || null;
  }

  public placeStructure(
    structure : Structure,
    x         : number,
    y         : number
  ) : void
  {
    let structureRow  = this.structures.get(x);

    if (!structureRow)
    {
      structureRow  = new Map();

      this.structures.set(
        x,
        structureRow
      );
    }

    structureRow.set(
      y,
      structure
    );
  }
}

const placedStructureManager  = new StandardPlacedStructureManager();

class Prototype4Scene extends Scene
{
  private tickingStructures : TickingStructure[];

  public constructor()
  {
    super("prototype4");

    this.tickingStructures  = [];
  }

  public create() : void
  {
    // Landscape

    this.createLandscape();

    // Add belts

    this.anims.create({
      "duration"  : 250,
      "key"       : "belt1",
      "repeat"    : -1,
      "frames"    : this.anims.generateFrameNumbers(
        "objects1Tileset",
        {
          "frames"  : [0, 1, 2, 3]
        }
      )
    });

    const belt1 = this.createBelt(4, 4);
    const belt2 = this.createBelt(5, 4);
    const belt3 = this.createBelt(6, 4);

    this.tickingStructures.push(
      belt1,
      belt2,
      belt3
    );

    setTimeout(
      () : void =>
      {
        this.tickingStructures.push(
          this.createBelt(7, 4)
        );

        belt2.giveMaterial(
          this.createMaterial(
            5,
            4
          )
        );
      },
      5000
    );

    setTimeout(
      () : void =>
      {
        this.tickingStructures.push(
          this.createBelt(8, 4)
        );

        this.tickingStructures.push(
          this.createBelt(9, 4)
        );

        this.tickingStructures.push(
          this.createBelt(10, 4)
        );
      },
      7000
    );

    // Add material

    belt1.giveMaterial(
      this.createMaterial(
        4,
        4
      )
    );
  }

  public createMaterial(
    x : number,
    y : number
  ) : Material
  {
    // TODO Real material sprite

    const material  = new StandardMaterial(
      this.add.sprite(
        x * 32,
        y * 32,
        "environment2Tileset",
        1
      )
    );

    material.getSprite().setDepth(3);

    return material;
  }

  public createBelt(
    x : number,
    y : number
  ) : Belt1
  {

    const beltSprite  = this.add.sprite(
      x * 32,
      y * 32,
      "objects1Tileset",
      1
    );

    beltSprite.play(
      "belt1"
    );

    const belt  = new Belt1(
      beltSprite,
      x,
      y
    );

    placedStructureManager.placeStructure(
      belt,
      x,
      y
    );

    belt.listenForMaterial(
      (
        event : MaterialProducedEvent
      ) : void =>
      {
        console.log("material notification received:", event);

        // TODO Inject placedStructureManager
        const possibleConsumer  = placedStructureManager.getStructureAt(
          event.getX(),
          event.getY()
        );

        if (
          possibleConsumer?.consumer &&
          possibleConsumer.consumesMaterial(event.checkMaterial())
        ) {
          console.log("handed over material to adjacent consumer");
          possibleConsumer.giveMaterial(event.takeMaterial());
        }
      }
    );

    return belt;
  }

  public update(
    worldTime : DOMHighResTimeStamp,
    delta     : number
  ) : void
  {
    for (const tickingStructure of this.tickingStructures)
    {
      tickingStructure.tick(
        worldTime,
        delta
      );
    }
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

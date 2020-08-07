import {
  Scene
} from "phaser";

interface Material
{

}

interface MaterialProducedEvent
{
  checkMaterial() : Material;

  hasBeenTaken()  : boolean;

  takeMaterial()  : Material;
}

class StandardMaterialProducedEvent implements MaterialProducedEvent
{
  private beenTaken : boolean;

  public constructor(
    private material  : Material
  ) {
    this.beenTaken  = false;
  }

  public checkMaterial()  : Material
  {
    return this.material;
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

type Structure  = Consumer | NonConsumer;

// TODO Autonomous (ticking) producer versus manual (clicking a button) producer. Materials can be emitted
// or stored in "warehouse" (global storage accessible by player)

class ManualMiner implements MaterialProducer, NonConsumer
{
  public consumer : false = false;

  private materialProducedListeners : MaterialProducedListenerManager;

  public constructor()
  {
    // TODO Inject
    this.materialProducedListeners  = new MaterialProducedListenerManager();
  }

  public emitMaterial() : void
  {
    this.materialProducedListeners.emitMaterial(
      new StandardMaterialProducedEvent(
        {}
      )
    );
  }

  public listenForMaterial(
    listener  : MaterialProducedListener
  ) : MaterialProducedListenerRemover
  {
    return this.materialProducedListeners.addListener(
      listener
    );
  }
}

interface StructureFactory
{
  construct(
    scene   : Scene,
    sceneX  : number,
    sceneY  : number,
    tileX   : number,
    tileY   : number
  ) : Structure;
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

const manualMinerStructureFactory  = {
  construct(
    scene   : Scene,
    sceneX  : number,
    sceneY  : number,
    tileX   : number,
    tileY   : number
  ) : Structure
  {
    // TODO Factory
    const manualMiner = new ManualMiner();

    // TODO New "dark grey" for manual buldings
    const sprite  = scene.add.sprite(
      sceneX,
      sceneY,
      "objects1Tileset",
      4
    );

    sprite.setInteractive();

    // When the manual miner is clicked, emit a material
    sprite.on(
      "pointerdown",
      ()  : void =>
      {
        // Fun little message!

        const thereYaGo  = scene.add.text(
          sprite.x - 48,
          sprite.y - 16,
          "There ya go!"
        );

        setInterval(
          () => thereYaGo.y -= 1,
          1000 / 32
        );

        setTimeout(
          () : void =>
          {
            thereYaGo.destroy();
          },
          750
        );

        manualMiner.emitMaterial();
      }
    );

    // For testing just show a message confiriming this click works
    manualMiner.listenForMaterial(
      (
        event : MaterialProducedEvent
      ) : void =>
      {
        // TODO Inject placedStructureManager
        // TODO Orientation
        const possibleConsumer  = placedStructureManager.getStructureAt(
          tileX,
          tileY + 1
        );

        if (
          possibleConsumer?.consumer &&
          possibleConsumer.consumesMaterial(event.checkMaterial())
        ) {
          possibleConsumer.giveMaterial(event.takeMaterial());
        }
      }
    );

    return manualMiner;
  }
} as StructureFactory;

class ManualAssembler implements Consumer
{
  public consumer : true  = true;

  public consumesMaterial(
    material  : Material
  ) : boolean
  {
    return !!material;
  }

  public giveMaterial(
    material  : Material
  ) : void
  {
    material;
  }
}

const manualAssemblerStructureFactory  = {
  construct(
    scene   : Scene,
    sceneX  : number,
    sceneY  : number
  ) : Structure
  {
    // TODO Factory
    const manualAssembler = new ManualAssembler();

    // TODO New "dark grey" for manual buldings
    scene.add.sprite(
      sceneX,
      sceneY,
      "objects1Tileset",
      5
    );

    return manualAssembler;
  }
} as StructureFactory;

type StructureType = "assembler0.1" | "miner0.1";

interface StructureService
{
  spawnStructure(
    type    : StructureType,
    sceneX  : number,
    sceneY  : number,
    tileX   : number,
    tileY   : number
  ) : void;
}

const structureServiceFactory = {
  construct(
    scene : Scene,
    structureFactories  : Map<StructureType, StructureFactory>
  ) : StructureService
  {
    return {
      spawnStructure(
        type    : StructureType,
        sceneX  : number,
        sceneY  : number,
        tileX   : number,
        tileY   : number
      ) : void
      {
        const structureFactory  = structureFactories.get(type);

        if (structureFactory)
        {
          placedStructureManager.placeStructure(
            structureFactory.construct(
              scene,
              sceneX,
              sceneY,
              tileX,
              tileY
            ),
            tileX,
            tileY
          );
        }
      }
    };
  }
};

class Prototype3Scene extends Scene
{
  public constructor()
  {
    super("prototype3");
  }

  public create() : void
  {
    // Instructions

    this.createInstructions();

    // Landscape

    this.createLandscape();

    // Structure management

    const structureService  = structureServiceFactory.construct(
      this,
      new Map(
        [
          [
            "assembler0.1",
            manualAssemblerStructureFactory
          ],
          [
            "miner0.1",
            manualMinerStructureFactory
          ]
        ]
      )
    );

    // Create structure blueprint menu

    // Spawn objects

    structureService.spawnStructure(
      "miner0.1",
      4 * 32,
      3 * 32,
      4,
      3
    );

    structureService.spawnStructure(
      "assembler0.1",
      4 * 32,
      4 * 32,
      4,
      4
    );
  }

  public createInstructions() : void
  {
    // Instructions

    this.add.rectangle(
      this.scale.width - 190,
      36,
      380,
      72,
      0x000000,
      0.6
    ).setDepth(10);

    this.add.text(
      this.scale.width - 370,
      0,
      "Click on the miner to emit a material."
    ).setDepth(10);

    this.add.text(
      this.scale.width - 370,
      24,
      "The assembler will accept the material"
    ).setDepth(10);

    this.add.text(
      this.scale.width - 370,
      48,
      "automatically."
    ).setDepth(10);
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

export default Prototype3Scene;

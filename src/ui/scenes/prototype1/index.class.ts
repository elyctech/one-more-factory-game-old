import {
  Scene
} from "phaser";

import Belt1Structure         from "../../../lib/structure/belt1/index.class";
import Structure              from "../../../lib/structure/index.type";
import StructureOrientation   from "../../../lib/structure-orientation/index.enum";

import placedStructureManager from "../../../app/placed-structure-manager";

type Node = "coal" | "empty";

interface FrameSet
{
  frames  : number[];
  texture : string;
}

interface Animation
{
  duration  : number;
  frames    : number[];
  key       : string;
  repeat    : number;
  texture   : string;
}

interface Blueprint
{
  canBePlaced   : Node[];
  structureType : string;
}

interface BuildMenuEntry
{
  blueprint   : Blueprint;
  frame       : number;
  texture     : string;
}

interface BuildMenu
{
  close() : void;

  isOpen()  : boolean;

  open()  : void;
}

const animationRepository = [
  {
    "duration"  : 250,
    "frames"    : [0, 1, 2, 3],
    "key"       : "belt1",
    "repeat"    : -1,
    "texture"   : "objects1Tileset"
  },
  {
    "duration"  : 0,
    "frames"    : [4],
    "key"       : "miner1",
    "repeat"    : 0,
    "texture"   : "objects1Tileset"
  }
] as Animation[];

const blueprintRepository = [
  {
    "structureType" : "belt1",

    "canBePlaced" : [
      "empty"
    ]
  },
  {
    "structureType" : "miner1",

    "canBePlaced" : [
      "coal"
    ]
  }
] as Blueprint[];

const buildMenuEntries  = [
  {
    "blueprint" : blueprintRepository[0],
    "frame"     : 0,
    "texture"   : "objects1Tileset"
  },
  {
    "blueprint" : blueprintRepository[1],
    "frame"     : 4,
    "texture"   : "objects1Tileset"
  }
] as BuildMenuEntry[];

const nodeFrames  = new Map<Node, FrameSet>(
  [
    [
      "coal",
      {
        "texture" : "environment2Tileset",
        "frames"  : [
          1,
          5,
          9
        ]
      }
    ]
  ]
);

type StructureInitializer = (
  sprite    : Phaser.GameObjects.Sprite
) => Structure;

const structureService  = {
  "structureInitializers" : new Map<string, StructureInitializer>(
    [
      [
        "belt1",
        (
          sprite    : Phaser.GameObjects.Sprite
        ) : Structure =>
        {
          // TODO Change to Map, key by animation key
          const animation = animationRepository[0];

          const animationDuration = animation.duration;
          const now               = performance.now();

          // timeout of dur - now % dur?
          sprite.play(
            animation.key
          );

          sprite.anims.setProgress(
            (now / animationDuration) % 1
          );

          return new Belt1Structure(
            StructureOrientation.Right,
            sprite.x / 32,
            sprite.y / 32
          );
        }
      ],
      [
        "miner1",
        (
          sprite  : Phaser.GameObjects.Sprite
        ) : Structure =>
        {
          // TODO
          sprite;
          return {} as unknown as any;
        }
      ]
    ]
  ),

  placeStructure(
    blueprint : Blueprint,
    sprite    : Phaser.GameObjects.Sprite
  ) : Structure
  {
    return this.structureInitializers.get(
      blueprint.structureType
    )!(
      sprite
    );
  }
};

const buildMenuService = {
  createMenu(
    entries : BuildMenuEntry[],
    scene   : Scene,

    onBlueprintSelected : (
      entry : BuildMenuEntry,
      x     : number,
      y     : number
    ) => void
  ) : BuildMenu
  {
    const x = scene.scale.width / 2;
    const y = scene.scale.height / 2;

    const columns = Math.ceil(Math.sqrt(entries.length));
    const rows    = Math.ceil(entries.length / columns);

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

    const buildMenuGroup  = scene.add.group([
      container,
      grid
    ]);

    for (let i = 0; i < entries.length; i += 1)
    {
      const entry = entries[i];

      const cellX = i % columns - columns / 2;
      const cellY = Math.floor(i / columns) - rows / 2;

      const entrySprite = scene.add.sprite(
        x + 32 * cellX + 16,
        y + 32 * cellY + 16,
        entry.texture,
        entry.frame
      );

      entrySprite.setInteractive();

      entrySprite.on(
        "pointerdown",
        (
          pointer : Phaser.Input.Pointer
        ) : void =>
        {
          onBlueprintSelected(
            entry,
            pointer.x,
            pointer.y
          );
        }
      );

      buildMenuGroup.add(
        entrySprite
      );
    }

    buildMenuGroup.setDepth(1);

    const buildMenu  = {
      close() : void
      {
        buildMenuGroup.setActive(false);
        buildMenuGroup.setVisible(false);
      },

      isOpen() : boolean
      {
        return buildMenuGroup.active;
      },

      open()  : void
      {
        buildMenuGroup.setActive(true);
        buildMenuGroup.setVisible(true);
      }
    };

    buildMenu.close();

    return buildMenu;
  }
};

class Prototype1Scene extends Scene
{
  private nodes       : Map<number, Map<number, Node>>      = new Map();
  private structures  : Map<number, Map<number, Structure>> = new Map();

  public constructor()
  {
    super("prototype1");
  }

  public create() : void
  {
    // Instructions

    this.add.rectangle(
      this.scale.width - 180,
      48,
      360,
      96,
      0x000000,
      0.6
    ).setDepth(10);

    this.add.text(
      this.scale.width - 350,
      0,
      "Press [ to bring up build menu."
    ).setDepth(10);

    this.add.text(
      this.scale.width - 350,
      24,
      "Structures will be transparent on"
    ).setDepth(10);

    this.add.text(
      this.scale.width - 350,
      48,
      "tiles they cannot be placed. They"
    ).setDepth(10);

    this.add.text(
      this.scale.width - 350,
      72,
      "turn opaque when they can be placed."
    ).setDepth(10);

    // Landscape

    const mapHeight = 32;
    const mapWidth  = 128;

    const landscape : number[][] = [];

    // Lay random tiles

    for (let i = 0; i < mapHeight; i += 1)
    {
      landscape[i]  = [];

      // Initialize containers while building landscape
      this.nodes.set(i, new Map());
      this.structures.set(i, new Map());

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

    // Animations

    // Conveyer belt

    for (const animation  of animationRepository)
    {
      this.anims.create({
        "duration"  : animation.duration,
        "key"       : animation.key,
        "repeat"    : animation.repeat,
        "frames"    : this.anims.generateFrameNumbers(
          animation.texture,
          {
            "frames"  : animation.frames
          }
        )
      });
    }

    // Scene

    // Coal

    this.addNode(
      "coal",
      4,
      2
    );

    // Place structures

    const attachSpriteToMouse = (
      blueprint : Blueprint,
      sprite    : Phaser.GameObjects.Sprite
    ) : () => void =>
    {
      const attacher = (
        pointer : Phaser.Input.Pointer
      ) : void =>
      {
        const tileX = Math.floor(pointer.x / 32);
        const tileY = Math.floor(pointer.y / 32);

        if (!this.structures.get(tileX)?.has(tileY))
        {
          sprite.x = tileX * 32;
          sprite.y = tileY * 32;

          // TODO Can we make this a "!"?
          const nodeType  = this.nodes.get(tileX)?.get(tileY) || "empty";

          if (blueprint.canBePlaced.includes(nodeType))
          {
            sprite.alpha = 1.0;
          }
          else
          {
            sprite.alpha = 0.5;
          }
        }
      };

      this.input.on(
        "pointermove",
        attacher
      );

      // Initialize the "placeable" state based on the pointer (this could be better)
      attacher(
        this.input.mousePointer
      );

      return () : void =>
      {
        this.input.off(
          "pointermove",
          attacher
        );
      };
    };

    // Objects menu

    const buildMenu = buildMenuService.createMenu(
      buildMenuEntries,
      this,
      (
        entry : BuildMenuEntry,
        x     : number,
        y     : number
      ) : void =>
      {
        buildMenu.close();

        const structureSprite = this.add.sprite(
          x,
          y,
          entry.texture,
          entry.frame
        );

        structureSprite.setOrigin(0);

        const unattachSprite  = attachSpriteToMouse(
          entry.blueprint,
          structureSprite
        );

        const cancelPlacement = () =>
        {
          unattachSprite();
          structureSprite.destroy();
        };

        const placeStructure  = () =>
        {
          // TODO This is the only current way to tell "placeability"
          if (structureSprite.alpha === 1.0)
          {
            // Remove canceling
            this.input.keyboard.off(
              "keydown-ESC",
              cancelPlacement
            );

            // Stop dragging structure around
            unattachSprite();

            // Spawn in the structure object tied to this sprite
            const structure = structureService.placeStructure(
              entry.blueprint,
              structureSprite
            );

            const tileX = Math.floor(structureSprite.x / 32);
            const tileY = Math.floor(structureSprite.y / 32);

            placedStructureManager.placeStructure(
              structure,
              tileX,
              tileY
            );

            // Fun little message!

            const plop  = this.add.text(
              structureSprite.x,
              structureSprite.y - 16,
              "Plop!"
            );

            setInterval(
              () => plop.y -= 1,
              1000 / 32
            );

            setTimeout(
              () : void =>
              {
                plop.destroy();
              },
              750
            );
          }
        };

        // TODO Solve this eventually
        // Wrap in a timeout to prevent the current event cycle from triggering this
        setTimeout(
          () : void =>
          {
            // Cancel
            this.input.keyboard.once(
              "keydown-ESC",
              cancelPlacement
            );

            // Place
            this.input.once(
              "pointerdown",
              placeStructure
            );
          },
          0
        );
      }
    );

    this.input.keyboard.on(
      "keyup-OPEN_BRACKET",
      ()  : void =>
      {
        if (buildMenu.isOpen())
        {
          buildMenu.close();
        }
        else
        {
          buildMenu.open();
        }
      }
    );
  }

  private addNode(
    type  : Node,
    x     : number,
    y     : number
  ) : void
  {
    let column  : Map<number, Node>;

    if (this.nodes.has(x))
    {
      column  = this.nodes.get(x)!;
    }
    else
    {
      column = new Map();

      this.nodes.set(x, column);
    }

    // TODO Check if a node already exists at this location
    column.set(
      y,
      type
    );

    const nodeFrameset  = nodeFrames.get(
      type
    )!;

    const frame = Math.floor(Math.random() * nodeFrameset.frames.length);

    const node  = this.add.sprite(
      x * 32,
      y * 32,
      nodeFrameset.texture,
      nodeFrameset.frames[frame]
    );

    node.setOrigin(0);
  }
}

export default Prototype1Scene;

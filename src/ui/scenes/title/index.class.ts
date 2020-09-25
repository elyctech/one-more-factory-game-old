import {
  Scene
} from "phaser";

class TitleScene extends Scene
{
  private prototypes = [
    {
      "id"    : "prototype1",
      "text"  : "Prototype 1 - Structure Placement"
    },
    {},
    {
      "id"    : "prototype3",
      "text"  : "Prototype 3 - Emitting Materials"
    },
    {
      "id"    : "prototype4",
      "text"  : "Prototype 4 - Transport Belts"
    },
    {
      "id"    : "prototype5",
      "text"  : "Prototype 5 - Emitting to Belts"
    }
  ];

  public constructor()
  {
    super("title");
  }

  public create() : void
  {
    const buttonHeight = 50;
    const start = this.scale.height / 2 - this.prototypes.length * buttonHeight / 2;

    for (let i = 0; i < this.prototypes.length; i += 1)
    {
      const prototype = this.prototypes[i];

      if (prototype.id)
      {
        this.addPrototypeButton(
          prototype.id,
          prototype.text,
          start + i * buttonHeight
        );
      }
    }
  }

  public addPrototypeButton(
    id    : string,
    text  : string,
    y     : number
  ) : void
  {
    // TODO UI tileset
    const prototypeButton   = this.add.image(this.scale.width / 2, y, "objects1Tileset", 31);
    prototypeButton.scaleX  = 16;
    prototypeButton.setInteractive();

    const prototypeButtonText  = this.add.text(0, 0, text);
    Phaser.Display.Align.In.Center(prototypeButtonText, prototypeButton);

    prototypeButton.on(
      "pointerup",
      () => this.scene.start(id)
    );
  }
}

export default TitleScene;

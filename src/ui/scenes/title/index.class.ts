import {
  Scene
} from "phaser";

class TitleScene extends Scene
{
  public constructor()
  {
    super("title");
  }

  public create() : void
  {
    this.addPrototypeButton(
      "prototype1",
      "Prototype 1 - Structure Placement",
      300
    );

    this.addPrototypeButton(
      "prototype3",
      "Prototype 3 - Emitting Materials",
      400
    );

    this.addPrototypeButton(
      "prototype4",
      "Prototype 4 - Transport Belts",
      450
    );
  }

  public addPrototypeButton(
    id    : string,
    text  : string,
    y     : number
  ) : void
  {
    // TODO UI tileset
    const prototypeButton  = this.add.image(this.scale.width / 2, y, "objects1Tileset", 31);
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

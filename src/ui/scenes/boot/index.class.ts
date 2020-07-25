import {
  Scene
} from "phaser";

import environmentImage   from "../../assets/environment-extruded.png";
import environment2Image  from "../../assets/environment2-extruded.png";
import objects1Image      from "../../assets/objects1.png";

class BootScene extends Scene
{
  public constructor()
  {
    super("boot");
  }

  public preload()
  {
    // Landscape

    this.load.image(
      "environmentTileset",
      environmentImage
    );

    this.load.spritesheet(
      "environment2Tileset",
      environment2Image,
      {
        "frameHeight" : 32,
        "frameWidth"  : 32
      }
    );

    // Objects

    this.load.spritesheet(
      "objects1Tileset",
      objects1Image,
      {
        "frameHeight" : 32,
        "frameWidth"  : 32
      }
    );
  }

  public create() : void
  {
    this.scene.start("prototype1");
  }
}

export default BootScene;

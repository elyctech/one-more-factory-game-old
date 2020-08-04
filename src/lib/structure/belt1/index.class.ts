import Structure  from "../index.type";

import Material             from "../../material/index.type";
import StructureOrientation from "../../structure-orientation/index.enum";
import TransportedMaterial  from "../../transported-material/index.type";

class Belt1Structure implements Structure
{
  private materials : TransportedMaterial[];

  private toX : number;
  private toY : number;

  public constructor(
    private orientation : StructureOrientation,
    private x           : number,
    private y           : number
  ) {
    this.materials  = [];

    if (orientation === StructureOrientation.Down)
    {
      this.toX  = x;
      this.toY  = y + 1;
    }
    else if (orientation === StructureOrientation.Left)
    {
      this.toX  = x - 1;
      this.toY  = y;
    }
    else if (orientation === StructureOrientation.Right)
    {
      this.toX  = x + 1;
      this.toY  = y;
    }
    else if (orientation === StructureOrientation.Up)
    {
      this.toX  = x;
      this.toY  = y - 1;
    }
  }

  public canReceive(
    // @ts-ignore This belt can accept any material
    material  : Material,
    fromX     : number,
    fromY     : number
  ) : boolean
  {
    let ontoPixelX  : number;
    let ontoPixelY  : number;

    if (fromX < this.x)
    {
      ontoPixelX  = this.x * 32;
    }
    else if (fromX > this.x)
    {
      ontoPixelX  = (this.x + 1) * 32 - 1;
    }
    else
    {
      ontoPixelX  = this.x * 32 + 16;
    }

    if (fromY < this.y)
    {
      ontoPixelY  = this.y * 32;
    }
    else if (fromY > this.y)
    {
      ontoPixelY  = (this.y + 1) * 32 - 1;
    }
    else
    {
      ontoPixelY  = this.y * 32 + 16;
    }

    console.log(ontoPixelX, ontoPixelY);

    return false;
  }

  public receive(
    // @ts-ignore For now
    material  : Material,
    // @ts-ignore For now
    fromX     : number,
    // @ts-ignore For now
    fromY     : number
  ) : void
  {

  }

  public tick(
    // @ts-ignore For now
    deltaSeconds  : number
  ) : void
  {
    for (const material of this.materials)
    {

    }
  }
}

export default Belt1Structure;

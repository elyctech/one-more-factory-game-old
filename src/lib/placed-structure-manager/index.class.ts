import PlacedStructureManager from "./index.type";

import Structure from "../structure/index.type";

class StandardPlacedStructureManager implements PlacedStructureManager
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

export default StandardPlacedStructureManager;

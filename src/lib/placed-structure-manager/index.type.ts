import Structure from "../structure/index.type";

interface PlacedStructureManager
{
  getStructureAt(
    x : number,
    y : number
  ) : Structure | null;

  placeStructure(
    structure : Structure,
    x         : number,
    y         : number
  ) : void;
}

export default PlacedStructureManager;

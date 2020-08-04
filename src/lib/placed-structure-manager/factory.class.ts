import PlacedStructureManagerFactory  from "./factory.type";

import StandardPlacedStructureManager from "./index.class";
import PlacedStructureManager         from "./index.type";

class StandardPlacedStructureManagerFactory implements PlacedStructureManagerFactory
{
  public construct() : PlacedStructureManager
  {
    return new StandardPlacedStructureManager();
  }
}

export default StandardPlacedStructureManagerFactory;

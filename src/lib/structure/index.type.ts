import Material from "../material/index.type";

interface Structure
{
  canReceive(
    material  : Material,
    fromX     : number,
    fromY     : number
  ) : boolean;

  receive(
    material  : Material,
    fromX     : number,
    fromY     : number
  ) : void;

  tick(
    deltaSeconds  : number
  ) : void;
}

export default Structure;

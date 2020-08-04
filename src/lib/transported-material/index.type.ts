import Material from "../material/index.type";

interface TransportedMaterial
{
  getMaterial() : Material;

  getX()  : number;

  getY()  : number;

  setX()  : number;

  setY()  : number;
}

export default TransportedMaterial;


import THREE from 'three';
import Gem from './gem';
import Model from './opal.json';
import RubyTexture from '../../images/ruby-texture.jpg';
import BumpMap from '../../images/Stoneseamless.png';
import SteelEnvMap from '../../images/envmap_steel.jpg';

export default class Opal extends Gem {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  get type() {
    return "opal";
  }

  constructor() {
    super(Opal.Geometry, new THREE.MeshPhongMaterial({
      color      :  new THREE.Color("#0000ff"),
      envMap     :  Opal.EnvMap,
    }));
  }

};

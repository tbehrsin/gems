
import THREE from 'three';
import Gem from './gem';
import Model from './diamond.json';
import RubyTexture from '../../images/ruby-texture.jpg';
import BumpMap from '../../images/Stoneseamless.png';
import SteelEnvMap from '../../images/envmap_steel.jpg';

export default class Diamond extends Gem {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  get type() {
    return "diamond";
  }

  constructor() {
    super(Diamond.Geometry, new THREE.MeshPhongMaterial({
      color      :  new THREE.Color("#ffff00"),
      envMap     :  Diamond.EnvMap,
    }));
  }

};


import THREE from 'three';
import Tile from './tile';
import Model from './nugget.json';
import RubyTexture from '../../images/ruby-texture.jpg';
import BumpMap from '../../images/Stoneseamless.png';
import SteelEnvMap from '../../images/envmap_steel.jpg';

export default class Nugget extends Tile {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor(type, color, multiplier, probability) {
    super(Nugget.Geometry, new THREE.MeshPhongMaterial({
      color      :  new THREE.Color(color),
      envMap     :  Nugget.EnvMap,
    }));
    this.type = type;
    this.multiplier = multiplier;
    this.probability = probability;
  }

};

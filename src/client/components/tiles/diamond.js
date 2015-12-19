
import THREE from 'three';
import Tile from './tile';
import Model from './diamond.json';
import BumpMap from '../../images/bump-step-08b.jpg';
import SteelEnvMap from '../../images/envmap_steel.jpg';

export default class Diamond extends Tile {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor(type, color, multiplier, probability) {
    super(Diamond.Geometry, new THREE.MeshPhongMaterial({
      color      :  new THREE.Color(color),
      specular: new THREE.Color(0x444444),
      bumpMap: Diamond.BumpMap,
      shading: THREE.SmoothShading,
      bumpScale: 0.05,
      shininess: 45,
      envMap:  Diamond.EnvMap
    }));
    this.type = type;
    this.multiplier = multiplier;
    this.probability = probability;
  }

};


import THREE from 'three';
import Tile from './tile';
import Model from './gem.json';
import RubyTexture from '../../images/ruby-texture.jpg';
import BumpMap from '../../images/11376-bump.jpg';
import SteelEnvMap from '../../images/envmap_brass.jpg';

export default class Gem extends Tile {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor(type, color, multiplier, probability) {
    super(Gem.Geometry, new THREE.MeshPhongMaterial({
      color      :  new THREE.Color(color),
      specular: new THREE.Color(0x444444),
      emissive: new THREE.Color(0xffffff),
      bumpMap: Gem.BumpMap,
      shading: THREE.SmoothShading,
      bumpScale: 0.05,
      shininess: 45,
      metal: false,
      envMap:  Gem.EnvMap,
      transparency: true
    }));
    this.type = type;
    this.multiplier = multiplier;
    this.probability = probability;
  }

};


Gem.Geometry.computeVertexNormals();
//Gem.Geometry.computeFaceNormals();

Gem.BumpMap.anisotropy = 4;
Gem.BumpMap.repeat.set( 0.998, 0.998 );
Gem.BumpMap.offset.set( 0.001, 0.001 )
Gem.BumpMap.wrapS = Gem.BumpMap.wrapT = THREE.RepeatWrapping;
Gem.BumpMap.format = THREE.RGBFormat;

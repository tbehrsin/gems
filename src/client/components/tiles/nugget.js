
import THREE from 'three';
import Tile from './tile';
import Model from './nugget.json';
import RubyTexture from '../../images/ruby-texture.jpg';
import BumpMap from '../../images/Stoneseamless.png';
import SteelEnvMap from '../../images/envmap_steel.jpg';

import FresnelShader from '../../shaders/fresnel';

export class Nugget extends Tile {
  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor(type, color, multiplier, probability) {
    super(Nugget.Geometry, new THREE.MeshPhongMaterial({
      color      :  color instanceof THREE.Color ? color : new THREE.Color(color),
      envMap     :  Nugget.EnvMap,
    }));
    this.type = type;
    this.multiplier = multiplier;
    this.probability = probability;
  }

};


export class GlassNugget extends Tile {

  static Probability = 0.014;

  static Geometry = new THREE.JSONLoader().parse(Model).geometry;
  static Map = THREE.ImageUtils.loadTexture(RubyTexture);
  static BumpMap = THREE.ImageUtils.loadTexture(BumpMap);
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor() {
    let fresnelUniforms = {
      "mRefractionRatio": { type: "f", value: 1.1 },
      "mFresnelBias": 	{ type: "f", value: 0.1 },
      "mFresnelPower": 	{ type: "f", value: 2.0 },
      "mFresnelScale": 	{ type: "f", value: 1.0 },
      "tCube": 			{ type: "t", value: Nugget.EnvMap }
    };

    let material = new THREE.ShaderMaterial({
      uniforms: fresnelUniforms,
      vertexShader: FresnelShader.vertexShader,
      fragmentShader: FresnelShader.fragmentShader
    });

    super(Nugget.Geometry, material);

    this.type = 'glass-nugget';
    this.multiplier = 50;
    this.probability = 0.014;
  }
}

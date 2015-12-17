
import THREE from 'three';
import SteelEnvMap from '../images/envmap_steel.jpg';
import FresnelShader from '../shaders/fresnel';
import Tween from '../tween';
import TextGeometry from './text';

export default class ProgressBar extends THREE.Object3D {
  static EnvMap = THREE.ImageUtils.loadTexture(SteelEnvMap);

  constructor(width, height, depth, min, max, value, textLeft) {
    super();

    this.width = width;
    this.height = height;

    this.min = min;
    this.max = max;
    this._value = value;
    this.tween = new Tween();

    let fresnelUniforms = {
      "mRefractionRatio": { type: "f", value: 1.1 },
      "mFresnelBias": 	{ type: "f", value: 0.1 },
      "mFresnelPower": 	{ type: "f", value: 2.0 },
      "mFresnelScale": 	{ type: "f", value: 1.0 },
      "tCube": 			{ type: "t", value: ProgressBar.EnvMap }
    };

    this.containerMaterial = new THREE.ShaderMaterial({
      uniforms: fresnelUniforms,
      vertexShader: FresnelShader.vertexShader,
      fragmentShader: FresnelShader.fragmentShader,
    });

    let containerGeometry = new THREE.BoxGeometry(width, height, 0.1, 2, 2, 2);

    this.container = new THREE.Mesh(containerGeometry, this.containerMaterial);
    this.add(this.container);


    this.textParams = {
      size: this.height / 2,
      height: 0.01,
      font: 'helvetiker',
      weight: 'bold',
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01
    };
    this.textMaterial = new THREE.MeshPhongMaterial({ color:  new THREE.Color("#777777"), shininess: 100, specular: new THREE.Color('#ffffff') });
    var textLeftGeometry = new TextGeometry(textLeft, this.textParams);
    this.textLeft = new THREE.Mesh(textLeftGeometry, this.textMaterial);

    this.add(this.textLeft);
  }

  set text(value) {
    this.remove(this.textLeft);
    var textLeftGeometry = new TextGeometry(value, this.textParams);
    this.textLeft = new THREE.Mesh(textLeftGeometry, this.textMaterial);
    this.add(this.textLeft);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.needsGeometryUpdate = true;
  }

  update(delta) {
    this.tween.update(delta);

    var box = new THREE.Box3().setFromObject(this.textLeft);
    this.textLeft.position.set(- (box.max.x - box.min.x) / 2, -(this.height - this.height / 2) / 2, 0.1);

    if(this.needsGeometryUpdate) {
      this.remove(this.container);
      let containerGeometry = new THREE.BoxGeometry(this.width * ((this.max - this.value) / (this.max - this.min)), this.height, 0.1, 2, 2, 2);
      this.container = new THREE.Mesh(containerGeometry, this.containerMaterial);
      this.container.translateX(this.width * (this.value / (this.max - this.min)) / 2);
      this.add(this.container);

      if(this.bar) this.remove(this.bar);
      let barGeom = new THREE.BoxGeometry(this.width * ((this.value) / (this.max - this.min)), this.height, 0.1, 2, 2, 2);
      this.bar = new THREE.Mesh(barGeom, new THREE.MeshPhongMaterial({color: 0x4466dd}));
      this.bar.translateX(-this.width * ((this.max - this.value) / (this.max - this.min)) / 2);
      this.add(this.bar);


      this.needsGeometryUpdate = false;
    }
  }

}

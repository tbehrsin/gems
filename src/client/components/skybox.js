
import THREE from 'three';

import LostValleyLeft from '../images/skybox_03.jpg';
import LostValleyRight from '../images/skybox_01.jpg';
import LostValleyTop from '../images/skybox_04.jpg';
import LostValleyFront from '../images/skybox_04.jpg';
import LostValleyBack from '../images/skybox_02.jpg';


export default class SkyBox extends THREE.Mesh {
  static Geometry = new THREE.CubeGeometry( 100000, 100000, 100000 );

  static get LostValley() {
    return new SkyBox([
      LostValleyRight,
      LostValleyLeft,
      LostValleyTop,
      LostValleyBack,
      LostValleyFront,
      LostValleyBack
    ]);
  }

  constructor(textures) {
    let texture = THREE.ImageUtils.loadTextureCube(textures);

    let shader = THREE.ShaderLib['cube'];
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms['tCube'].value = texture;

    let geometry = new THREE.CubeGeometry( 100, 100, 100 );
    let material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });

    super(geometry, material);
  }
}

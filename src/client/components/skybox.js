
import THREE from 'three';

export default class SkyBox extends THREE.Mesh {
  static Geometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

  constructor(texture) {
    let shader = THREE.ShaderLib['cube'];
    let uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    uniforms['tCube'].value = texture;

    let geometry = SkyBox.Geometry;
    let material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });

    super(geometry, material);
  }
}

/**
 * Normal map shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "heightMap"	: { type: "t", value: 0, texture: null },
    "resolution": { type: "v2", value: new THREE.Vector2( 512, 512 ) },
    "scale"		: { type: "v2", value: new THREE.Vector2( 1, 1 ) },
    "height"	: { type: "f", value: 0.05 }
  }
};

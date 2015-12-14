/**
 * Triangle blur shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "texture": { type: "t", value: 0, texture: null },
    "delta": { type: "v2", value: new THREE.Vector2(1, 1) }
  }
};

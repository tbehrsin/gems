/**
 * Convolution shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "tDiffuse": { type: "t", value: 0, texture: null },
    "uImageIncrement": { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
    "cKernel": { type: "fv1", value: [] }
  }
};

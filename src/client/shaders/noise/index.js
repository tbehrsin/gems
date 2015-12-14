/**
 * Simplex noise shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    time:   { type: "f", value: 1.0 },
    scale:  { type: "v2", value: new THREE.Vector2( 1.5, 1.5 ) },
    offset: { type: "v2", value: new THREE.Vector2( 0, 0 ) }
  }
};

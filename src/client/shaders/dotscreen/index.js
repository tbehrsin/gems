/**
 * Dot screen shader
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tDiffuse: { type: "t", value: 0, texture: null },
    tSize:    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
    center:   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
    angle:	  { type: "f", value: 1.57 },
    scale:	  { type: "f", value: 1.0 }
  }
};

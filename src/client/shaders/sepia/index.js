/**
 * Sepia tone shader
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tDiffuse: { type: "t", value: 0, texture: null },
    amount:   { type: "f", value: 1.0 }
  }
};

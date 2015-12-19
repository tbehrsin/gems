/**
 * Vignette shader
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tDiffuse: { type: "t", value: 0, texture: null },
    offset:   { type: "f", value: 1 },
    darkness: { type: "f", value: 1.25 }
  }
};

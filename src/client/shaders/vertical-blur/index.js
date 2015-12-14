/**
 * Vertical two pass Gaussian blur filter
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "tDiffuse": { type: "t", value: 0, texture: null },
    "v": 		{ type: "f", value: 1.0 / 512.0 }
  }
};

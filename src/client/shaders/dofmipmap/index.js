/**
 * Depth-of-field shader using mipmaps
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tColor:   { type: "t", value: 0, texture: null },
    tDepth:   { type: "t", value: 1, texture: null },
    focus:    { type: "f", value: 1.0 },
    maxblur:  { type: "f", value: 1.0 }
  }
};

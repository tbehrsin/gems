/**
 * Depth-of-field shader with bokeh
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
    aspect:   { type: "f", value: 1.0 },
    aperture: { type: "f", value: 0.025 },
    maxblur:  { type: "f", value: 1.0 }
  }
};

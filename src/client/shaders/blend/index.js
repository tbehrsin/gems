/**
 * Blend two textures
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tDiffuse1: { type: "t", value: 0, texture: null },
    tDiffuse2: { type: "t", value: 1, texture: null },
    mixRatio:  { type: "f", value: 0.5 },
    opacity:   { type: "f", value: 1.0 }
  }
};

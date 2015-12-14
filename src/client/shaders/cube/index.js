/**
 * Simple test shader
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tCube: {type: "t", value: 1, texture: null}
  }
};


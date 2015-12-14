/**
 * Focus shader
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "tDiffuse": 		{ type: "t", value: 0, texture: null },
    "screenWidth": 		{ type: "f", value: 1024 },
    "screenHeight": 	{ type: "f", value: 1024 },
    "sampleDistance": 	{ type: "f", value: 0.94 },
    "waveFactor": 		{ type: "f", value: 0.00125 }
  }
};

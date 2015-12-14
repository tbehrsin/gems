/**
 * Film grain & scanlines shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    tDiffuse:   { type: "t", value: 0, texture: null },
    time: 	    { type: "f", value: 0.0 },
    nIntensity: { type: "f", value: 0.5 },
    sIntensity: { type: "f", value: 0.05 },
    sCount: 	{ type: "f", value: 4096 },
    grayscale:  { type: "i", value: 1 }
  }
};

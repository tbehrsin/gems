/**
 * Simple test shader
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "mRefractionRatio": { type: "f", value: 1.02 },
    "mFresnelBias": { type: "f", value: 0.1 },
    "mFresnelPower": { type: "f", value: 2.0 },
    "mFresnelScale": { type: "f", value: 1.0 },
    "vBaseColor": { type: "v4", value: new THREE.Vector4(1,1,1,1) },
    "tCube": { type: "t", value: null }
  }
};

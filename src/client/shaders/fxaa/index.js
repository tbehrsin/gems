/**
 * NVIDIA FXAA by Timothy Lottes
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "tDiffuse": 	{ type: "t", value: 0, texture: null },
    "resolution": 	{ type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 )  }
  }
};

/**
 * Simple fake tilt-shift effect, modulating two pass Gaussian blur (see above) by vertical position
 *	- 9 samples per pass
 *	- standard deviation 2.7
 *	- "h" and "v" parameters should be set to "1 / width" and "1 / height"
 *	- "r" parameter control where "focused" horizontal line lies
 */

import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: {
    "tDiffuse": { type: "t", value: 0, texture: null },
    "h": 		{ type: "f", value: 1.0 / 512.0 },
    "r": 		{ type: "f", value: 0.35 }
  }
};

/**
 * Dynamic terrain shader
 * 	- Blinn-Phong
 *	- height + normal + diffuse1 + diffuse2 + specular + detail maps
 * 	- point and directional lights (use with "lights: true" material option)
 */

import THREE from 'three';
import VertexShader from './vertex.glsl';
import FragmentShader from './fragment.glsl';

export default {
  vertexShader: VertexShader,

  fragmentShader: FragmentShader,

  uniforms: THREE.UniformsUtils.merge([

    THREE.UniformsLib[ "fog" ],
    THREE.UniformsLib[ "lights" ],

    {

      "enableDiffuse1"  : { type: "i", value: 0 },
      "enableDiffuse2"  : { type: "i", value: 0 },
      "enableSpecular"  : { type: "i", value: 0 },
      "enableReflection": { type: "i", value: 0 },

      "tDiffuse1"	   : { type: "t", value: 0, texture: null },
      "tDiffuse2"	   : { type: "t", value: 1, texture: null },
      "tDetail"	   : { type: "t", value: 2, texture: null },
      "tNormal"	   : { type: "t", value: 3, texture: null },
      "tSpecular"	   : { type: "t", value: 4, texture: null },
      "tDisplacement": { type: "t", value: 5, texture: null },

      "uNormalScale": { type: "f", value: 1.0 },

      "uDisplacementBias": { type: "f", value: 0.0 },
      "uDisplacementScale": { type: "f", value: 1.0 },

      "uDiffuseColor": { type: "c", value: new THREE.Color( 0xeeeeee ) },
      "uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
      "uAmbientColor": { type: "c", value: new THREE.Color( 0x050505 ) },
      "uShininess": { type: "f", value: 30 },
      "uOpacity": { type: "f", value: 1 },

      "uRepeatBase"    : { type: "v2", value: new THREE.Vector2( 1, 1 ) },
      "uRepeatOverlay" : { type: "v2", value: new THREE.Vector2( 1, 1 ) },

      "uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) }

    }

  ])
};
